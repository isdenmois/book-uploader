<script>
  import { createEventDispatcher, onMount } from 'svelte';
  export let disabled;
  let queryInput;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const params = new URLSearchParams(location.search);
    queryInput.value = params.get('q') || '';
  });

  function handleSubmit() {
    dispatch('search', { query: queryInput.value });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:this={queryInput} name="query" autofocus placeholder="Search books" {disabled} />
</form>

<style>
  input {
    width: 100%;
  }
</style>
