<script>
  import Search from './search.svelte';
  import { searchHandler } from './api';

  let books = [];

  async function search({ detail: { query } }) {
    const { data, error } = await searchHandler(query);

    if (error) {
      return alert(error);
    }

    console.log(data);

    books = data;
  }
</script>

<main>
  <Search on:search={search} />

  <ul>
    {#each books as { link, title, authors }, i}
      <li><a target="_blank" href="/api/rewrite?path={link}"> {title} </a></li>
    {/each}
  </ul>
</main>
