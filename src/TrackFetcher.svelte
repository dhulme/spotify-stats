<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
	import { getTracks } from "./api.js";
	
	const dispatch = createEventDispatcher();

  export let playlistId;

  let progressValue = 0;

  $: (async () => {
    if (playlistId) {
			dispatch('tracksChanged', []);
			progressValue = 10;
      const tracks = await getTracks(playlistId, (value, total) => {
        progressValue = Math.round((value / total) * 100);
      });
			progressValue = 100;
			dispatch('tracksChanged', tracks);
    }
	})();
	
</script>

{#if progressValue !== 100}
	<progress class="progress is-info" value={progressValue} max="100">
		{progressValue}%
	</progress>
{/if}