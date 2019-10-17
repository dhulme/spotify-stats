<script>
import { onMount } from 'svelte';
	import {logIn, initUser, initToken} from './api.js';
	import SelectPlaylist from './SelectPlaylist.svelte';
	import TrackFetcher from './TrackFetcher.svelte';
	import ChartTracks from './ChartTracks.svelte';
	import ChartArtist from './ChartArtist.svelte';
	import ChartTopArtists from './ChartTopArtists.svelte';

	let user;
	let initUserPromise;
	let playlistId;
	let tracks = [];

	onMount(async () => {
		await initToken();
		initUserPromise = initUser();
		user = await initUserPromise;
	})
</script>

<style>
	.user {
		color: #fff;
	}

	.credits {
		border-left: 1px solid #fff;
		font-size: .75rem;
	}

	.credits a {
		color: #fff;
	}
</style>

  <nav class="navbar is-info">
		<div class="navbar-brand">
			<div class="navbar-item">
				Spotify Stats
			</div>
			<div class="navbar-item">
				{#if user}<SelectPlaylist on:playlistSelected={e => playlistId = e.detail} />{/if}
			</div>
		</div>
		
    <div class="navbar-end">
			<div class="navbar-item">
					{#await initUserPromise}
						<p>Loading...</p>
					{:then user}
						{#if user}
							<p class="user">{user.displayName}</p>
						{/if}
					{:catch error}
						<p>Failed to get user</p>
					{/await}
			</div>
			<div class="navbar-item credits">
				<p>
				Built using <a href="https://svelte.dev/">Svelte</a><br>
				<a href="https://github.com/dhulme/spotify-stats">github.com/dhulme/spotify-stats</a>
				</p>
			</div>
    </div>
  </nav>

	<section class="section">
	{#if user}
		<TrackFetcher {playlistId} on:tracksChanged={e => tracks = e.detail} />
		{#if tracks.length}
			<ChartTracks {tracks} />
			<ChartArtist {tracks} />
			<ChartTopArtists {tracks} />
		{/if}
	{/if}
	</section>