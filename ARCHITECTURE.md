# Architecture

## Overview

This app stays intentionally small, but it is split into a few clear layers so the calculator rules remain easy to test and reason about:

- `src/lib/components/` for presentational Svelte components
- `src/lib/features/calculator/` for the calculator state machine and view-model assembly
- `src/lib/utils/` for pure calculation and formatting helpers

The goal is to keep business rules out of the view layer and make future changes easier to verify.

## Data Flow

1. `Calculator.svelte` creates the calculator controller and derives a view model from the current store state.
2. The feature controller owns the state store and exposes action methods.
3. Pure helpers in `src/lib/utils/` handle math and formatting.
4. `Header`, `LanguageSwitch`, and `CalculatorRow` only render props and emit callbacks.

## Key Decisions

- The calculator state is driven by a reducer so the behavior stays explicit and easy to extend.
- Math and formatting are kept pure so they can be unit tested without the component layer.
- Buttons carry stable `id` values instead of relying on labels as keys.
- Language strings live in one place to avoid hard-coded translated text in components.
- The result display is a single accessible status region, which keeps the UI easier to test.

## File Map

- `src/App.svelte` - top-level application shell
- `src/main.ts` - Svelte entry point
- `src/lib/features/calculator/calculator.ts` - state machine, controller, and button model
- `src/lib/utils/calculatorEngine.ts` - calculator math
- `src/lib/utils/resultFormatter.ts` - output formatting and display helpers
- `src/lib/constants.ts` - shared button labels and operator constants
- `src/lib/i18n.ts` - translated strings and language helpers
- `src/lib/types.ts` - shared calculator and language types
- `src/lib/components/Calculator.svelte` - calculator composition and controller wiring
- `src/lib/components/Header.svelte` - result display
- `src/lib/components/LanguageSwitch.svelte` - locale selector
- `src/lib/components/CalculatorRow.svelte` - button row renderer

## Snapshot Coverage

- `tests/visual/playwright.config.ts` configures Playwright to store screenshots in a portable, per-test snapshot layout.
- `tests/visual/calculator.spec.ts` covers the default shell, error states, language switching, and core arithmetic flows.

## Testing Strategy

- Unit tests cover the pure math and formatting helpers.
- Component tests cover calculator interactions and language switching.
- Visual tests cover the calculator shell and common interaction states.

## Future Improvements

- Split the calculator feature controller into smaller domain helpers if the feature set grows.
- Add keyboard support if the app needs desktop-first accessibility.
- Expand the visual test suite if more screens or calculator states are added.
