import { createHeader } from './header';

describe('createHeader', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renders the header with title and button', () => {
    const headerEl = createHeader('body', 'afterbegin');

    const header = document.querySelector('.header');
    expect(header).toBeInstanceOf(HTMLElement);
    expect(header?.querySelector('.header__title')?.textContent).toBe('Productos');

    const button = header?.querySelector('.header__nav-button');
    expect(button).toBeInstanceOf(HTMLElement);
    expect(button?.getAttribute('aria-controls')).toBe('add');

    expect(headerEl).toBe(header);
  });
});