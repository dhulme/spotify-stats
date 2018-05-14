<template>
  <div id="app">
    <button @click="logIn">Log in</button>

    <p>Choose a playlist</p>
    <select v-model="playlistId">
      <option
        v-for="playlist in playlists"
        :key="playlist.id"
        :value="playlist.id"
      >
        {{ playlist.name }}
      </option>
    </select>
    <button @click="analyze">Analyze!</button>
    <div v-if="fetchPercent">
      Loading tracks {{ fetchPercent }}%...
    </div>
  </div>
</template>

<script>
import auth from './auth';

export default {
  name: 'App',
  methods: {
    logIn() {
      auth.logIn();
    },
    async analyze() {
      const tracks = await auth.getTracks(this.playlistId, (value, total) => {
        this.fetched = value;
        this.fetchedTotal = total;
      });
      this.fetched = this.fetchedTotal;
      console.log(tracks);
    }
  },
  data() {
    return {
      playlists: [],
      playlistId: null,
      fetched: 0,
      fetchedTotal: 0,
    };
  },
  computed: {
    fetchPercent() {
      return Math.round((this.fetched / this.fetchedTotal) * 100);
    },
  },
  async created() {
    await auth.setUser();
    const playlists = await auth.getPlaylists();
    this.playlists = playlists;
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
