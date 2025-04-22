import { createFormAdd } from './form.add';
import { fireEvent } from '@testing-library/dom';
import { vi } from 'vitest';

describe('createFormAdd', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renders a form with correct class and aria-label', () => {
    const form = createFormAdd([], 'body', 'afterbegin');
    expect(form.tagName).toBe('FORM');
    expect(form.classList.contains('add_form')).toBe(true);
    expect(form.getAttribute('aria-label')).toBe('add_form');
  });

  test('prevents default on submit', () => {
    const form = createFormAdd([], 'body', 'afterbegin');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefault = vi.fn();
    Object.defineProperty(submitEvent, 'preventDefault', { value: preventDefault });

    fireEvent(form, submitEvent);
    expect(preventDefault).toHaveBeenCalled();
  });
});
