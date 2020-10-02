<script>
  export let item;
</script>

<style>
  li a {
    color: black;
    padding-top: 20px;
    display: block;
  }
  li:first-child a {
    padding-top: 0;
  }
</style>

<li>
  <a target="_blank" href="/api/rewrite?path={item.link}">
    <div>{item.title}</div>
    {#if item.authors}
      <div>{item.authors}</div>
    {/if}
    {#if item.translation}
      <div>Translation: {item.translation}</div>
    {/if}
    {#if item.lang}
      <div>Lang: {item.lang}</div>
    {/if}
    {#if item.size}
      <div>Size: {item.size}</div>
    {/if}
  </a>
</li>
