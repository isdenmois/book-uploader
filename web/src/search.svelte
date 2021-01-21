<script>
  import { createEventDispatcher, onMount } from 'svelte';
  export let disabled;
  let queryInput;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('q')) {
      queryInput.value = params.get('q') || '';
      handleSubmit();
    }
  });

  function handleSubmit() {
    dispatch('search', { query: queryInput.value });

    if (history.replaceState) {
      const url = `${location.protocol}//${location.host}${location.pathname}?q=${queryInput.value}`;

      history.replaceState({ path: url }, '', url);
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:this={queryInput} placeholder="Search books" {disabled} autofocus />
</form>

<style>
  input {
    width: 100%;
  }
</style>
