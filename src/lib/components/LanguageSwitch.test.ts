import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LanguageSwitch from './LanguageSwitch.svelte';

describe('LanguageSwitch', () => {
  it('highlights the active language and emits selections', async () => {
    const user = userEvent.setup();
    const onChangeLanguage = vi.fn();

    render(LanguageSwitch, {
      props: {
        languages: [
          { key: 'en-US', label: 'EN', active: true },
          { key: 'es-ES', label: 'ES', active: false },
        ],
        onChangeLanguage,
      },
    });

    expect(screen.getByRole('button', { name: 'EN' })).toHaveClass(
      'calculator-language-active'
    );
    expect(screen.getByRole('button', { name: 'ES' })).not.toHaveClass(
      'calculator-language-active'
    );

    expect(onChangeLanguage).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'ES' }));

    expect(onChangeLanguage).toHaveBeenCalledTimes(1);
    expect(onChangeLanguage).toHaveBeenCalledWith('es-ES');
  });
});
