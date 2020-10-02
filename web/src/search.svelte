<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleSubmit(event) {
    const formData = new FormData(event.target);

    dispatch('search', { query: formData.get('query') });
  }
</script>

<style>
  input {
    width: 100%;
  }
</style>

<form on:submit|preventDefault={handleSubmit}><input name="query" autofocus placeholder="Search books" /></form>
