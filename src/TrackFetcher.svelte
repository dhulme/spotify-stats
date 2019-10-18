<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import { getTracks, getLibraryTracks } from "./api.js";

  const dispatch = createEventDispatcher();

  export let playlistId;

  let tracksProgressValue = 0;
  let libraryTracksProgressValue = 0;
  let libraryTracks = [];

  $: (async () => {
    if (playlistId) {
      dispatch("tracksChanged", []);
      tracksProgressValue = 0;
      const tracks = await getTracks(playlistId, (value, total) => {
        tracksProgressValue = Math.round((value / total) * 100);
      });
      tracksProgressValue = 100;
      dispatch("tracksChanged", tracks);
    } else {
      dispatch("tracksChanged", libraryTracks);
    }
  })();

  onMount(async () => {
    libraryTracksProgressValue = 0;
    libraryTracks = await getLibraryTracks((value, total) => {
      libraryTracksProgressValue = Math.round((value / total) * 100);
    });
    libraryTracksProgressValue = 100;
  });
</script>

{#if libraryTracksProgressValue !== 100}
  <progress
    class="progress is-info"
    value={libraryTracksProgressValue}
    max="100">
    {libraryTracksProgressValue}%
  </progress>
{/if}

{#if tracksProgressValue !== 100 && tracksProgressValue !== 0}
  <progress class="progress is-info" value={tracksProgressValue} max="100">
    {tracksProgressValue}%
  </progress>
{/if}
