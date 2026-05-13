<script lang="ts">
  import { get } from 'svelte/store';
  import Header from './Header.svelte';
  import LanguageSwitch from './LanguageSwitch.svelte';
  import CalculatorRow from './CalculatorRow.svelte';
  import { createCalculatorController } from '$lib/features/calculator/calculator';
  import { translate } from '$lib/i18n';

  const calculator = createCalculatorController();
  const { state: calculatorState, actions, createViewModel } = calculator;

  let viewModel = createViewModel(get(calculatorState));
  $: viewModel = createViewModel($calculatorState);
</script>

<section class="calculator">
  <LanguageSwitch
    languages={viewModel.languages}
    onChangeLanguage={actions.handleLanguageChange}
  />
  <div class="calculator-shell">
    <Header
      title={translate(viewModel.currentLanguage, 'calculator')}
      displayValue={viewModel.displayValue}
      error={viewModel.error}
    />

    {#each viewModel.buttonRows as buttons (buttons[0].id)}
      <CalculatorRow {buttons} />
    {/each}
  </div>
</section>
