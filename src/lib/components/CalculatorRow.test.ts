import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CalculatorRow from './CalculatorRow.svelte';

describe('CalculatorRow', () => {
  it('renders each button and forwards clicks', async () => {
    const user = userEvent.setup();
    const firstClick = vi.fn();
    const secondClick = vi.fn();

    render(CalculatorRow, {
      props: {
        buttons: [
          {
            id: 'first',
            label: 'First',
            onClick: firstClick,
            className: 'calculator-button calculator-button--special',
          },
          {
            id: 'second',
            label: 'Second',
            onClick: secondClick,
            disabled: true,
          },
        ],
      },
    });

    const firstButton = screen.getByRole('button', { name: 'First' });
    const secondButton = screen.getByRole('button', { name: 'Second' });

    expect(firstButton).toHaveClass('calculator-button--special');
    expect(secondButton).toHaveClass('calculator-button');
    expect(secondButton).toBeDisabled();

    await user.click(firstButton);

    expect(firstClick).toHaveBeenCalledTimes(1);
    expect(secondClick).not.toHaveBeenCalled();
  });
});
