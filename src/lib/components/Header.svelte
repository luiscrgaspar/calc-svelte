<script lang="ts">
  export let title: string;
  export let displayValue: string;
  export let error: string;
</script>

<div class="calculator-header">
  <span class="calculator-header-title">{title}</span>
  <div class="calculator-header-result">
    <span
      data-testid="result"
      role="status"
      aria-live={error ? 'assertive' : 'polite'}
      aria-atomic="true"
      class="calculator-header-result-text"
      class:calculator-header-result-text--error={Boolean(error)}
    >
      {displayValue}
    </span>
  </div>
</div>
