<script lang="ts">
  import type { Language } from '$lib/types';

  export let languages: Language[] = [];
  export let onChangeLanguage: (language: Language['key']) => void;
</script>

<div class="calculator-languages">
  {#each languages as language (language.key)}
    <button
      type="button"
      aria-pressed={language.active}
      class="calculator-language"
      class:calculator-language-active={language.active}
      on:click={() => onChangeLanguage(language.key)}
    >
      {language.label}
    </button>
  {/each}
</div>
