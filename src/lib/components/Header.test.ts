import { render, screen } from '@testing-library/svelte';
import Header from './Header.svelte';

describe('Header', () => {
  it('renders the title and current value', () => {
    render(Header, { props: { title: 'Calculator', displayValue: '42', error: '' } });

    expect(screen.getByText('Calculator')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('42');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('switches the live region to assertive when an error is present', () => {
    render(Header, {
      props: {
        title: 'Calculator',
        displayValue: 'Cannot divide by zero',
        error: 'divided_by_zero',
      },
    });

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByRole('status')).toHaveClass('calculator-header-result-text--error');
  });
});
