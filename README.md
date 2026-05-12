# Calc Svelte

Calc Svelte is a Svelte 5 + TypeScript calculator built with Vite. It follows the same layered approach as the React reference app: pure calculator helpers, a small feature controller, presentational components, and automated unit and visual tests.

## Features

- Basic arithmetic, repeated equals behavior, and chained operations
- Scientific helpers for square, cube, square root, cube root, factorial, reciprocal, percentage, and constants
- Memory controls for store, recall, and clear
- Language switching for English, Spanish, and Portuguese
- Accessible result output with a responsive layout

## Tech Stack

- Svelte 5
- TypeScript
- Vite
- Vitest
- Playwright
- Testing Library for Svelte

## Getting Started

Install dependencies:

```bash
yarn install
```

Start the development server:

```bash
yarn dev
```

Run the Svelte type checks:

```bash
yarn check
```

Build the app:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

## Testing

Run the unit test suite:

```bash
yarn test
```

Run the test watcher while developing:

```bash
yarn test:watch
```

Generate the coverage report:

```bash
yarn test:coverage
```

Run the Playwright visual regression suite:

```bash
yarn test:visual
```

If the UI changes intentionally, refresh the snapshots with:

```bash
yarn test:visual:update
```

## Project Structure

- `src/lib/components/` contains presentational UI components
- `src/lib/features/calculator/` contains the calculator state machine and view-model wiring
- `src/lib/utils/` contains pure math and formatting helpers
- `src/lib/constants.ts`, `src/lib/types.ts`, and `src/lib/i18n.ts` hold shared button labels, types, and translations
- `src/App.svelte` and `src/main.ts` wire the app into Vite and Svelte
- `tests/visual/` contains the Playwright visual regression suite and snapshots

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a deeper explanation of the design.
# Calc Svelte

Calc Svelte is a Svelte 5 + TypeScript calculator built with Vite. It follows the same layered approach as the React reference app: pure calculator helpers, a small feature controller, presentational components, and automated unit and visual tests.

## Features

- Basic arithmetic, repeated equals behavior, and chained operations
- Scientific helpers for square, cube, square root, cube root, factorial, reciprocal, percentage, and constants
- Memory controls for store, recall, and clear
- Language switching for English, Spanish, and Portuguese
- Accessible result output with a responsive layout

## Tech Stack

- Svelte 5
- TypeScript
- Vite
- Vitest
- Playwright
- Testing Library for Svelte

## Getting Started

Install dependencies:

```bash
yarn install
```

Start the development server:

```bash
yarn dev
```

Run the Svelte type checks:

```bash
yarn check
```

Build the app:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

## Testing

Run the unit test suite:

```bash
yarn test
```

Run the test watcher while developing:

```bash
yarn test:watch
```

Generate the coverage report:

```bash
yarn test:coverage
```

Run the Playwright visual regression suite:

```bash
yarn test:visual
```

If the UI changes intentionally, refresh the snapshots with:

```bash
yarn test:visual:update
```

## Project Structure

- `src/lib/components/` contains presentational UI components
- `src/lib/features/calculator/` contains the calculator state machine and view-model wiring
- `src/lib/utils/` contains pure math and formatting helpers
- `src/lib/constants.ts`, `src/lib/types.ts`, and `src/lib/i18n.ts` hold shared button labels, types, and translations
- `src/App.svelte` and `src/main.ts` wire the app into Vite and Svelte
- `tests/visual/` contains the Playwright visual regression suite and snapshots

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a deeper explanation of the design.
