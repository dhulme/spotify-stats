<template>
  <div id="app">
    <button @click="logIn">Log in</button>
  </div>
</template>

<script>
import auth from './auth';

export default {
  name: 'App',
  methods: {
    logIn() {
      auth.logIn();
    }
  },
  created() {
    auth.auth();
  }
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
