import { render, screen } from '@testing-library/svelte';
import App from './App.svelte';

describe('App', () => {
  it('renders the calculator inside the app shell', () => {
    render(App);

    expect(screen.getByRole('main')).toHaveClass('app');
    expect(screen.getByText('Calculator')).toBeVisible();
  });
});
