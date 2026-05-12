import { afterEach, expect, it, vi } from 'vitest';

const { mountMock } = vi.hoisted(() => ({
  mountMock: vi.fn(),
}));

vi.mock('svelte', () => ({
  mount: mountMock,
}));

vi.mock('./App.svelte', () => ({
  default: {},
}));

describe('main', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('boots the app into the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('./main');

    expect(mountMock).toHaveBeenCalledTimes(1);
    expect(mountMock).toHaveBeenCalledWith({}, { target: document.getElementById('root') });
  });
});
