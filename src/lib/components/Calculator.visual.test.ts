/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import { render, screen } from '@testing-library/svelte';
import { CALCULATOR_BUTTON_LINES } from '$lib/constants';
import Calculator from './Calculator.svelte';

describe('Calculator visual smoke test', () => {
  it('keeps the calculator layout intact', () => {
    const { container } = render(Calculator);

    expect(container.querySelector('.calculator')).toBeInTheDocument();
    expect(container.querySelector('.calculator-shell')).toBeInTheDocument();
    expect(container.querySelectorAll('.calculator-row')).toHaveLength(
      Object.keys(CALCULATOR_BUTTON_LINES).length
    );
    expect(container.querySelector('.calculator-header-result')).toBeVisible();
    expect(screen.getByRole('button', { name: '=' })).toHaveClass(
      'calculator-button--equal'
    );
  });
});
