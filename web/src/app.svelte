<script>
  import Search from './search.svelte';
  import Spinner from './spinner.svelte';
  import ListItem from './list-item.svelte';
  import { searchHandler } from './api';

  let books = null;
  let loading = false;

  async function search({ detail: { query } }) {
    loading = true;
    books = null;

    const { data, error } = await searchHandler(query);

    loading = false;

    if (error) {
      books = null;
      return alert(error);
    }

    console.log(data);

    books = data;
  }
</script>

<style>
  .center {
    display: flex;
    justify-content: center;
  }
  .mt15 {
    margin-top: 15px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>

<main>
  <Search on:search={search} disabled={loading} />

  {#if loading}
    <div class="center mt15">
      <Spinner />
    </div>
  {/if}

  {#if books !== null && books.length > 0}
    <ul>
      {#each books as item, i}
        <ListItem {item} />
      {/each}
    </ul>
  {:else if books !== null}
    <div class="center mt15">Ничего не найдено</div>
  {/if}
</main>
