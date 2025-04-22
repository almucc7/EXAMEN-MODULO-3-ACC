/**
 * @vitest-environment node
 */
import { ProductsController } from './products.controller';
import { Request, Response, NextFunction } from 'express';
import { vi, Mock } from 'vitest';


const mockRepo = {
  read: vi.fn().mockResolvedValueOnce([]),
  readById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

describe('ProductsController', () => {  
  const controller = new ProductsController(mockRepo);
  
  const baseReq = {
    params: { id: '1' },
    body: {},
  } as unknown as Request;
  const res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;

  const error = new Error('Error de prueba');

  test('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(ProductsController);
  });

  describe('getAll method', () => {
    test('should call json when repo response is valid', async () => {
      await controller.getAll(baseReq, res, next);
      expect(mockRepo.read).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ results: [], error: '' });
    });

    test('should call next when repo throws an error', async () => {
      (mockRepo.read as Mock).mockRejectedValueOnce(error);
      await controller.getAll(baseReq, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getById method', () => {
    test('should call json when repo response is valid', async () => {
      const product = { id: 1, name: 'Test' };
      (mockRepo.readById as Mock).mockResolvedValueOnce(product);
      await controller.getById(baseReq, res, next);
      expect(mockRepo.readById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ results: [product], error: '' });
    });

    test('should call next when repo throws an error', async () => {
      (mockRepo.readById as Mock).mockRejectedValueOnce(error);
      await controller.getById(baseReq, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create method', () => {
    test('should call status 201 and json when repo response is valid', async () => {
      const newData = { name: 'New', price: 10 };
      const created = { id: 2, ...newData };
      const req = {
        params: { id: '1' },
        body: newData,
      } as unknown as Request;
      (mockRepo.create as Mock).mockResolvedValueOnce(created);

      await controller.create(req, res, next);
      expect(mockRepo.create).toHaveBeenCalledWith(newData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ results: [created], error: '' });
    });

    test('should call next when repo throws an error', async () => {
      const req = {
        params: { id: '1' },
        body: {},
      } as unknown as Request;
      (mockRepo.create as Mock).mockRejectedValueOnce(error);
      await controller.create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update method', () => {
    test('should call json when repo response is valid', async () => {
      const updateData = { price: 20 };
      const updated = { id: 1, ...updateData };
      const req = {
        params: { id: '1' },
        body: updateData,
      } as unknown as Request;
      (mockRepo.update as Mock).mockResolvedValueOnce(updated);

      await controller.update(req, res, next);
      expect(mockRepo.update).toHaveBeenCalledWith('1', updateData);
      expect(res.json).toHaveBeenCalledWith({ results: [updated], error: '' });
    });

    test('should call next when repo throws an error', async () => {
      const req = {
        params: { id: '1' },
        body: {},
      } as unknown as Request;
      (mockRepo.update as Mock).mockRejectedValueOnce(error);
      await controller.update(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('delete method', () => {
    test('should call json when repo response is valid', async () => {
      const deleted = { id: 1, name: 'Del' };
      (mockRepo.delete as Mock).mockResolvedValueOnce(deleted);

      await controller.delete(baseReq, res, next);
      expect(mockRepo.delete).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ results: [deleted], error: '' });
    });

    test('should call next when repo throws an error', async () => {
      (mockRepo.delete as Mock).mockRejectedValueOnce(error);
      await controller.delete(baseReq, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
