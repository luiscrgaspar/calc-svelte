<script lang="ts">
  import type { CalculatorButton } from '$lib/types';

  export let buttons: CalculatorButton[] = [];
</script>

<div class="calculator-row">
  {#each buttons as button (button.id)}
    <button
      type="button"
      class={button.className ?? 'calculator-button'}
      disabled={button.disabled ?? false}
      on:click={button.onClick}
    >
      {button.label}
    </button>
  {/each}
</div>
