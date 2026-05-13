import { get } from 'svelte/store';
import { writable } from 'svelte/store';
import {
  ADDITION_OPERATOR,
  CALCULATOR_BUTTON_LINES,
  DIVISION_OPERATOR,
  EQUAL_BUTTON_CLASSES,
  LANGUAGE_LABELS,
  MULTIPLICATION_OPERATOR,
  SUBTRACTION_OPERATOR,
} from '$lib/constants';
import { translate } from '$lib/i18n';
import type {
  CalculatorButton,
  CalculatorErrorKey,
  CalculatorState,
  Language,
  LanguageCode,
  Operator,
} from '$lib/types';
import {
  calculateBinaryOperation,
  calculateCube,
  calculateCubicRoot,
  calculateFactorial,
  calculatePercentage,
  calculateReciprocal,
  calculateSquare,
  calculateSquareRoot,
} from '$lib/utils/calculatorEngine';
import {
  formatReciprocalResult,
  formatResult,
  formatRootResult,
} from '$lib/utils/resultFormatter';

type Action =
  | { type: 'setLanguage'; payload: LanguageCode }
  | { type: 'addToCurrentValue'; payload: string }
  | { type: 'setCurrentValue'; payload: string }
  | { type: 'setCurrentTemporaryValue'; payload: string }
  | { type: 'setCurrentMemoryValue'; payload: string }
  | { type: 'setCurrentOperator'; payload: Operator | '' }
  | { type: 'setGoingToDoOperation'; payload: boolean }
  | { type: 'setIsInfinity'; payload: boolean }
  | { type: 'setAlreadyDoneEqualOperation'; payload: boolean }
  | { type: 'setError'; payload: CalculatorErrorKey | '' }
  | { type: 'reset' };

function createDefaultLanguages(): Language[] {
  return LANGUAGE_LABELS.map((language, index) => ({
    ...language,
    active: index === 0,
  }));
}

export function getCurrentLanguage(languages: Language[]): LanguageCode {
  return languages.find((language) => language.active)?.key ?? 'en-US';
}

export function createInitialState(): CalculatorState {
  return {
    languages: createDefaultLanguages(),
    currentValue: '0',
    currentTemporaryValue: '',
    currentMemoryValue: '',
    currentOperator: '',
    goingToDoOperation: false,
    isInfinity: false,
    alreadyDoneEqualOperation: false,
    error: '',
  };
}

export function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'setLanguage':
      return {
        ...state,
        languages: state.languages.map((language) => ({
          ...language,
          active: language.key === action.payload,
        })),
      };
    case 'addToCurrentValue': {
      if (action.payload === '.' && state.goingToDoOperation) {
        return {
          ...state,
          goingToDoOperation: false,
          currentValue: '0.',
        };
      }

      if (action.payload === '.' && state.currentValue.includes('.')) {
        return state;
      }

      const currentValue =
        (state.currentValue === '0' && action.payload !== '.') || state.goingToDoOperation
          ? action.payload
          : `${state.currentValue}${action.payload}`;

      return {
        ...state,
        currentValue,
        goingToDoOperation: false,
      };
    }
    case 'setCurrentValue':
      return { ...state, currentValue: action.payload };
    case 'setCurrentTemporaryValue':
      return { ...state, currentTemporaryValue: action.payload };
    case 'setCurrentMemoryValue':
      return { ...state, currentMemoryValue: action.payload };
    case 'setCurrentOperator':
      return { ...state, currentOperator: action.payload };
    case 'setGoingToDoOperation':
      return { ...state, goingToDoOperation: action.payload };
    case 'setIsInfinity':
      return { ...state, isInfinity: action.payload };
    case 'setAlreadyDoneEqualOperation':
      return { ...state, alreadyDoneEqualOperation: action.payload };
    case 'setError':
      return { ...state, error: action.payload };
    case 'reset':
      return {
        ...state,
        currentValue: '0',
        currentTemporaryValue: '',
        currentOperator: '',
        isInfinity: false,
        error: '',
        goingToDoOperation: false,
        alreadyDoneEqualOperation: false,
      };
    default:
      return state;
  }
}

function isNumeric(value: string): boolean {
  return !Number.isNaN(+value);
}

function createButton(
  id: string,
  label: string,
  onClick: () => void,
  options: Omit<CalculatorButton, 'id' | 'label' | 'onClick'> = {}
): CalculatorButton {
  return {
    id,
    label,
    onClick,
    ...options,
  };
}

function createBinaryOperationButton(
  onOperation: (operator: Operator) => void,
  operator: Operator,
  id: string,
  label: string
) {
  return createButton(id, label, () => onOperation(operator));
}

export function createCalculatorController() {
  const state = writable<CalculatorState>(createInitialState());

  function dispatch(action: Action) {
    state.update((currentState) => reducer(currentState, action));
  }

  function reset() {
    dispatch({ type: 'reset' });
  }

  function setCurrentValue(value: string) {
    dispatch({ type: 'setCurrentValue', payload: value });
  }

  function setCurrentTemporaryValue(value: string) {
    dispatch({ type: 'setCurrentTemporaryValue', payload: value });
  }

  function setCurrentMemoryValue(value: string) {
    dispatch({ type: 'setCurrentMemoryValue', payload: value });
  }

  function setCurrentOperator(value: Operator | '') {
    dispatch({ type: 'setCurrentOperator', payload: value });
  }

  function setGoingToDoOperation(value: boolean) {
    dispatch({ type: 'setGoingToDoOperation', payload: value });
  }

  function setIsInfinity(value: boolean) {
    dispatch({ type: 'setIsInfinity', payload: value });
  }

  function setAlreadyDoneEqualOperation(value: boolean) {
    dispatch({ type: 'setAlreadyDoneEqualOperation', payload: value });
  }

  function setError(value: CalculatorErrorKey | '') {
    dispatch({ type: 'setError', payload: value });
  }

  function clearTransientFailureState() {
    setError('');
    setIsInfinity(false);
  }

  function startFreshNumericEntry(value: string) {
    setCurrentValue(value);
    setCurrentTemporaryValue('0');
    setCurrentOperator('');
    setGoingToDoOperation(false);
    setAlreadyDoneEqualOperation(false);
    clearTransientFailureState();
  }

  function getDisplayValue(currentState: CalculatorState, currentLanguage: LanguageCode) {
    if (currentState.error) {
      return translate(currentLanguage, currentState.error);
    }

    if (currentState.isInfinity) {
      return currentState.currentValue === '-Infinity'
        ? translate(currentLanguage, '-infinity')
        : translate(currentLanguage, 'infinity');
    }

    return currentState.currentValue;
  }

  function clickOnPiKey() {
    setCurrentValue(Math.PI.toFixed(11));
    clearTransientFailureState();
  }

  function clickOnCEKey() {
    const currentState = get(state);

    if (currentState.error !== '' || currentState.isInfinity) {
      reset();
      return;
    }

    setCurrentValue('0');
  }

  function clickOnMCKey() {
    setCurrentMemoryValue('');
  }

  function clickOnMRKey() {
    const currentState = get(state);
    setCurrentValue(currentState.currentMemoryValue);
    clearTransientFailureState();
  }

  function clickOnMSKey() {
    const currentState = get(state);

    if (currentState.currentValue !== '0') {
      setCurrentMemoryValue(currentState.currentValue);
    }
  }

  function clickOnPercentageKey() {
    const currentState = get(state);
    setCurrentValue(
      calculatePercentage(+currentState.currentValue, currentState.currentOperator !== '')
    );
  }

  function clickOnBackKey() {
    const currentState = get(state);
    const trimmedValue =
      currentState.currentValue.length === 1 ? '0' : currentState.currentValue.slice(0, -1);

    setCurrentValue(trimmedValue === '' || trimmedValue === '-' ? '0' : trimmedValue);
  }

  function applyFormattedResult(result: number) {
    const currentState = get(state);
    const formattedResult = formatResult(result, currentState.currentOperator);
    const displayResult = formattedResult.isInfinity ? result.toString() : formattedResult.value;

    clearTransientFailureState();
    setIsInfinity(formattedResult.isInfinity);
    setCurrentValue(displayResult);

    return displayResult;
  }

  function setErrorCurrentValue(error: CalculatorErrorKey) {
    setIsInfinity(false);
    setError(error);
  }

  function getPendingBinaryOperationResult(alreadyRepeated: boolean) {
    const currentState = get(state);

    if (!currentState.currentOperator || Number.isNaN(+currentState.currentValue)) {
      return null;
    }

    const currentValueNumber = +currentState.currentValue;
    const currentTemporaryValueNumber = +currentState.currentTemporaryValue;
    const result = calculateBinaryOperation(
      currentState.currentOperator,
      currentTemporaryValueNumber,
      currentValueNumber,
      alreadyRepeated
    );

    return {
      currentValueNumber,
      result,
    };
  }

  function clickOnXToThePowerOf2() {
    const currentState = get(state);
    applyFormattedResult(calculateSquare(+currentState.currentValue));
  }

  function clickOnXToThePowerOf3() {
    const currentState = get(state);
    applyFormattedResult(calculateCube(+currentState.currentValue));
  }

  function setResultOperationOrInvalidInput(value: number, error: CalculatorErrorKey) {
    clearTransientFailureState();

    if (Number.isNaN(value)) {
      setError(error);
      return;
    }

    setError('');
    setCurrentValue(formatRootResult(value));
  }

  function clickOnSquareRoot() {
    const currentState = get(state);
    setResultOperationOrInvalidInput(
      calculateSquareRoot(+currentState.currentValue),
      'invalid_number_for_square_root'
    );
  }

  function clickOnCubicRoot() {
    const currentState = get(state);
    setResultOperationOrInvalidInput(
      calculateCubicRoot(+currentState.currentValue),
      'invalid_number_for_cubic_root'
    );
  }

  function clickOnFactorial() {
    const currentState = get(state);
    const result = calculateFactorial(+currentState.currentValue);

    if (typeof result === 'string') {
      setErrorCurrentValue(result);
      return;
    }

    applyFormattedResult(result);
  }

  function clickOnOneDividedByX() {
    const currentState = get(state);
    const result = calculateReciprocal(+currentState.currentValue);

    if (typeof result === 'string') {
      setErrorCurrentValue(result);
      return;
    }

    clearTransientFailureState();
    setCurrentValue(formatReciprocalResult(result));
  }

  function clickOnEKey() {
    setCurrentValue(Math.E.toFixed(11));
    clearTransientFailureState();
  }

  function clickOnNumber(number: string | number) {
    const currentState = get(state);
    const numberValue = number.toString();

    if (currentState.error || currentState.isInfinity || currentState.alreadyDoneEqualOperation) {
      startFreshNumericEntry(numberValue);
      return;
    }

    clearTransientFailureState();
    dispatch({ type: 'addToCurrentValue', payload: numberValue });
  }

  function clickOnNumberZero() {
    const currentState = get(state);

    if (currentState.error || currentState.isInfinity || currentState.alreadyDoneEqualOperation) {
      startFreshNumericEntry('0');
      return;
    }

    clearTransientFailureState();

    if (currentState.currentValue !== '0') {
      dispatch({ type: 'addToCurrentValue', payload: '0' });
    }
  }

  function clickOnPlusMinusKey() {
    const currentState = get(state);
    setCurrentValue((+currentState.currentValue * -1).toString());
  }

  function clickOnPointKey() {
    const currentState = get(state);

    if (currentState.error || currentState.isInfinity || currentState.alreadyDoneEqualOperation) {
      startFreshNumericEntry('0');
      dispatch({ type: 'addToCurrentValue', payload: '.' });
      return;
    }

    clearTransientFailureState();

    if (
      currentState.goingToDoOperation ||
      (isNumeric(currentState.currentValue) && currentState.currentValue.indexOf('.') === -1)
    ) {
      dispatch({ type: 'addToCurrentValue', payload: '.' });
    }
  }

  function clickOnEqualKey() {
    const currentState = get(state);
    const pendingResult = getPendingBinaryOperationResult(currentState.alreadyDoneEqualOperation);

    if (!pendingResult) {
      return;
    }

    const { currentValueNumber, result } = pendingResult;

    if (typeof result === 'string') {
      setErrorCurrentValue(result);
      return;
    }

    if (!currentState.alreadyDoneEqualOperation) {
      setCurrentTemporaryValue(currentValueNumber.toString());
      setAlreadyDoneEqualOperation(true);
    }

    setGoingToDoOperation(false);
    applyFormattedResult(result);
  }

  function operation(operator: Operator) {
    const currentState = get(state);
    const hadAlreadyDoneEqualOperation = currentState.alreadyDoneEqualOperation;
    setAlreadyDoneEqualOperation(false);

    if (hadAlreadyDoneEqualOperation) {
      setCurrentTemporaryValue(currentState.currentValue);
      setCurrentOperator(operator);
      setGoingToDoOperation(true);
      return;
    }

    if (currentState.goingToDoOperation) {
      setCurrentOperator(operator);
      return;
    }

    if (currentState.currentOperator !== '') {
      const pendingResult = getPendingBinaryOperationResult(false);

      if (!pendingResult) {
        return;
      }

      const { result } = pendingResult;

      if (typeof result === 'string') {
        setErrorCurrentValue(result);
        return;
      }

      const displayResult = applyFormattedResult(result);
      setCurrentTemporaryValue(displayResult);
      setCurrentOperator(operator);
      setGoingToDoOperation(true);
      return;
    }

    setCurrentTemporaryValue(currentState.currentValue);
    setCurrentOperator(operator);
    setGoingToDoOperation(true);
  }

  function handleLanguageChange(language: LanguageCode) {
    dispatch({ type: 'setLanguage', payload: language });
  }

  function createButtonRows(currentState: CalculatorState): CalculatorButton[][] {
    return [
      [
        createButton('pi', CALCULATOR_BUTTON_LINES.line1[0], clickOnPiKey),
        createButton('ce', CALCULATOR_BUTTON_LINES.line1[1], clickOnCEKey),
        createButton('clear', CALCULATOR_BUTTON_LINES.line1[2], reset),
        createButton('backspace', CALCULATOR_BUTTON_LINES.line1[3], clickOnBackKey),
      ],
      [
        createButton('memory-clear', CALCULATOR_BUTTON_LINES.line2[0], clickOnMCKey, {
          disabled: !currentState.currentMemoryValue,
        }),
        createButton('memory-recall', CALCULATOR_BUTTON_LINES.line2[1], clickOnMRKey, {
          disabled: !currentState.currentMemoryValue,
        }),
        createButton('memory-store', CALCULATOR_BUTTON_LINES.line2[2], clickOnMSKey),
        createButton('percentage', CALCULATOR_BUTTON_LINES.line2[3], clickOnPercentageKey),
      ],
      [
        createButton('square', CALCULATOR_BUTTON_LINES.line3[0], clickOnXToThePowerOf2),
        createButton('cube', CALCULATOR_BUTTON_LINES.line3[1], clickOnXToThePowerOf3),
        createButton('square-root', CALCULATOR_BUTTON_LINES.line3[2], clickOnSquareRoot),
        createButton('cubic-root', CALCULATOR_BUTTON_LINES.line3[3], clickOnCubicRoot),
      ],
      [
        createButton('factorial', CALCULATOR_BUTTON_LINES.line4[0], clickOnFactorial),
        createButton('reciprocal', CALCULATOR_BUTTON_LINES.line4[1], clickOnOneDividedByX),
        createButton('constant-e', CALCULATOR_BUTTON_LINES.line4[2], clickOnEKey),
        createBinaryOperationButton(
          operation,
          DIVISION_OPERATOR,
          'divide',
          CALCULATOR_BUTTON_LINES.line4[3]
        ),
      ],
      [
        createButton('seven', CALCULATOR_BUTTON_LINES.line5[0], () => clickOnNumber('7')),
        createButton('eight', CALCULATOR_BUTTON_LINES.line5[1], () => clickOnNumber('8')),
        createButton('nine', CALCULATOR_BUTTON_LINES.line5[2], () => clickOnNumber('9')),
        createBinaryOperationButton(
          operation,
          MULTIPLICATION_OPERATOR,
          'multiply',
          CALCULATOR_BUTTON_LINES.line5[3]
        ),
      ],
      [
        createButton('four', CALCULATOR_BUTTON_LINES.line6[0], () => clickOnNumber('4')),
        createButton('five', CALCULATOR_BUTTON_LINES.line6[1], () => clickOnNumber('5')),
        createButton('six', CALCULATOR_BUTTON_LINES.line6[2], () => clickOnNumber('6')),
        createBinaryOperationButton(
          operation,
          SUBTRACTION_OPERATOR,
          'subtract',
          CALCULATOR_BUTTON_LINES.line6[3]
        ),
      ],
      [
        createButton('one', CALCULATOR_BUTTON_LINES.line7[0], () => clickOnNumber('1')),
        createButton('two', CALCULATOR_BUTTON_LINES.line7[1], () => clickOnNumber('2')),
        createButton('three', CALCULATOR_BUTTON_LINES.line7[2], () => clickOnNumber('3')),
        createBinaryOperationButton(
          operation,
          ADDITION_OPERATOR,
          'add',
          CALCULATOR_BUTTON_LINES.line7[3]
        ),
      ],
      [
        createButton('toggle-sign', CALCULATOR_BUTTON_LINES.line8[0], clickOnPlusMinusKey),
        createButton('zero', CALCULATOR_BUTTON_LINES.line8[1], clickOnNumberZero),
        createButton('decimal', CALCULATOR_BUTTON_LINES.line8[2], clickOnPointKey),
        createButton('equals', CALCULATOR_BUTTON_LINES.line8[3], clickOnEqualKey, {
          disabled: Boolean(currentState.error || currentState.isInfinity),
          className: EQUAL_BUTTON_CLASSES[3],
        }),
      ],
    ];
  }

  function createViewModel(currentState: CalculatorState) {
    const currentLanguage = getCurrentLanguage(currentState.languages);

    return {
      currentLanguage,
      displayValue: getDisplayValue(currentState, currentLanguage),
      error: currentState.error,
      languages: currentState.languages,
      buttonRows: createButtonRows(currentState),
    };
  }

  return {
    state,
    actions: {
      handleLanguageChange,
    },
    createViewModel,
  };
}
