<script>
  import { onMount } from "svelte";
  import Chart from "./Chart.svelte";

  export let tracks;

  let chart;

  const numberArtistsOptions = [10, 20, 30, 50];
  let numberArtists = 20;

  $: {
    const data = tracks.reduce((artistCounts, item) => {
      const artist = item.track.artists[0].name;
      const artistCount = artistCounts[artist];
      artistCounts[artist] = artistCount ? artistCount + 1 : 1;
      return artistCounts;
    }, {});
    const topArtists = Object.keys(data)
      .sort((a, b) => {
        return data[b] - data[a];
      })
      .slice(0, numberArtists);

    chart = {
      type: "bar",
      data: {
        labels: topArtists,
        datasets: [
          {
            data: topArtists.map(artist => data[artist]),
            borderColor: "#209cee",
            backgroundColor: "#209cee"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              type: "linear",
              ticks: {
                precision: 0,
                min: 0
              },
              scaleLabel: {
                labelString: "Tracks",
                display: true
              }
            }
          ]
        }
      }
    };
  }
</script>

<Chart {chart} title="Top Artists">
  <div class="select" slot="controls">
    <select bind:value={numberArtists}>
      {#each numberArtistsOptions as value (value)}
        <option {value}>{value}</option>
      {/each}
    </select>
  </div>
</Chart>
