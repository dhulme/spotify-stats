<template>
  <table>
    <thead>
      <th>Name</th>
    <tbody>
      <tr v-for="playlist in playlists">
        
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    playlists: {
      required: true,
      type: Array,
    },
  },
};
</script>

