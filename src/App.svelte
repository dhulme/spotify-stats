<script>
  import { onMount } from "svelte";
  import { logIn, logOut, initUser, initToken } from "./api.js";
  import SelectPlaylist from "./SelectPlaylist.svelte";
  import TrackFetcher from "./TrackFetcher.svelte";
  import ChartTracks from "./ChartTracks.svelte";
  import ChartArtist from "./ChartArtist.svelte";
  import ChartTopArtists from "./ChartTopArtists.svelte";

  let user;
  let initUserPromise;
  let playlistId;
  let tracks = [];

  onMount(async () => {
    await initToken();
    initUserPromise = initUser();
    user = await initUserPromise;
  });

  function handleLogOut() {
    logOut();
    user = null;
  }
</script>

<style>
  .user {
    color: #fff;
    margin-right: 0.5rem;
  }

  .credits {
    font-size: 0.75rem;
    color: #fff;
  }

  .credits a {
    color: #fff;
  }

  .navbar-brand {
    display: block;
  }

  .profile-photo {
    margin-right: 0.5rem;
    border-radius: 50%;
  }

  @media (min-width: 1024px) {
    .navbar-brand {
      display: flex;
    }

    .credits {
      border-left: 1px solid #fff;
    }
  }
</style>

<nav class="navbar is-info">
  <div class="navbar-brand">
    <div class="navbar-item">Spotify Stats</div>
    <div class="navbar-item">
      {#if user}
        <SelectPlaylist on:playlistSelected={e => (playlistId = e.detail)} />
      {/if}
    </div>
  </div>

  <div class="navbar-end">
    <div class="navbar-item">
      {#await initUserPromise}
        <p>Loading...</p>
      {:then user}
        {#if user}
          {#if user.image}
            <img class="profile-photo" src={user.image} alt="Profile photo" />
          {/if}
          <p class="user">{user.displayName}</p>
          <button class="button is-small" on:click={handleLogOut}>
            Log out
          </button>
        {/if}
      {:catch error}
        <p>Failed to get user</p>
      {/await}
    </div>
    <div class="navbar-item credits">
      <p>
        Built using
        <a href="https://svelte.dev/">Svelte</a>
        <br />
        <a href="https://github.com/dhulme/spotify-stats">
          github.com/dhulme/spotify-stats
        </a>
      </p>
    </div>
  </div>
</nav>

<section class="section">
  {#if user}
    <TrackFetcher {playlistId} on:tracksChanged={e => (tracks = e.detail)} />
    {#if tracks.length}
      <ChartTracks {tracks} />
      <ChartArtist {tracks} />
      <ChartTopArtists {tracks} />
    {/if}
  {/if}
</section>
