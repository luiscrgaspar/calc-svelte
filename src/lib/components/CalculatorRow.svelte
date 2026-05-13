<script lang="ts">
  import type { CalculatorButton } from '$lib/types';

  export let buttons: CalculatorButton[] = [];

  function getButtonClass(className?: string) {
    return Array.from(
      new Set(['calculator-button', ...(className?.split(/\s+/) ?? [])].filter(Boolean))
    ).join(' ');
  }
</script>

<div class="calculator-row">
  {#each buttons as button (button.id)}
    <button
      type="button"
      class={getButtonClass(button.className)}
      disabled={button.disabled ?? false}
      on:click={button.onClick}
    >
      {button.label}
    </button>
  {/each}
</div>
