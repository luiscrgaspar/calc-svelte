import { createInitialState, getCurrentLanguage, reducer } from './calculator';

describe('calculator reducer', () => {
  it('starts a fresh decimal when the user presses dot after an operator', () => {
    const state = {
      ...createInitialState(),
      goingToDoOperation: true,
    };

    const nextState = reducer(state, { type: 'addToCurrentValue', payload: '.' });

    expect(nextState.currentValue).toBe('0.');
    expect(nextState.goingToDoOperation).toBe(false);
  });

  it('ignores a duplicate decimal point', () => {
    const state = {
      ...createInitialState(),
      currentValue: '12.3',
    };

    expect(reducer(state, { type: 'addToCurrentValue', payload: '.' })).toBe(state);
  });

  it('falls back to the current state for unknown actions', () => {
    const state = createInitialState();

    expect(reducer(state, { type: 'unknown' } as never)).toBe(state);
  });

  it('falls back to English when no language is active', () => {
    const languages = createInitialState().languages.map((language) => ({
      ...language,
      active: false,
    }));

    expect(getCurrentLanguage(languages)).toBe('en-US');
  });
});
