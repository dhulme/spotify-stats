<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { getPlaylists } from "./api.js";

  const dispatch = createEventDispatcher();

  let playlists = [];
  let loadingPlaylists = false;
  let selectedPlaylistId = null;

  onMount(async () => {
    loadingPlaylists = true;
    playlists = await getPlaylists();
    loadingPlaylists = false;
  });

  let debounceTimeout;
  $: {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(
      () => {
        dispatch("playlistSelected", selectedPlaylistId);
      },
      500,
      selectedPlaylistId
    );
  }
</script>

<div class="select" class:is-loading={loadingPlaylists}>
  <select bind:value={selectedPlaylistId}>
		<option value={null}>Library</option>
    {#each playlists as playlist (playlist.id)}
      <option value={playlist.id}>{playlist.name}</option>
    {/each}
  </select>
</div>
