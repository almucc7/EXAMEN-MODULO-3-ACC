import { ApiRepo } from '../services/api.repo';
import { vi } from 'vitest';

describe('ApiRepo', () => {
  let repo: ApiRepo;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    repo = new ApiRepo();
    fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('getProducts: success', async () => {
    const data = [{ id: 1, name: 'X' }];
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => data });

    const result = await repo.getProducts();
    expect(fetchMock).toHaveBeenCalledWith(repo.apiUrl);
    expect(result).toEqual(data);
  });

  test('getProducts: error', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found' });
    await expect(repo.getProducts()).rejects.toThrow('404 Not Found');
  });

  test('createProduct: success', async () => {
    const newProd = { name: 'Y' };
    const created = { id: 2, ...newProd };
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => created });

    const result = await repo.createProduct(newProd);
    expect(fetchMock).toHaveBeenCalledWith(
      repo.apiUrl,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newProd),
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(result).toEqual(created);
  });

  test('createProduct: error', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Oops' });
    await expect(repo.createProduct({})).rejects.toThrow('500 Oops');
  });

  test('updateProduct: success', async () => {
    const updatedData = { name: 'Updated' };
    const updated = { id: 1, ...updatedData };
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => updated });

    const result = await repo.updateProduct(1, updatedData);
    expect(fetchMock).toHaveBeenCalledWith(
      `${repo.apiUrl}/1`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(updatedData),
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(result).toEqual(updated);
  });

  test('updateProduct: error', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 400, statusText: 'Bad Request' });
    await expect(repo.updateProduct(2, {})).rejects.toThrow('400 Bad Request');
  });

  test('deleteProduct: success', async () => {
    const responseArr = [{ id: 1 }];
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => responseArr });

    const result = await repo.deleteProduct(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${repo.apiUrl}/1`,
      expect.objectContaining({ method: 'DELETE' })
    );
    expect(result).toEqual(responseArr);
  });

  test('deleteProduct: error', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 403, statusText: 'Forbidden' });
    await expect(repo.deleteProduct(1)).rejects.toThrow('403 Forbidden');
  });
});
