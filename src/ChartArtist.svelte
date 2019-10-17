<script>
  import { onMount } from "svelte";
  import Chart from "./Chart.svelte";

  export let tracks;

  let chart;

  $: {
    const data = tracks.reduce((artistCounts, item) => {
      const artist = item.track.artists[0].name;
      const artistCount = artistCounts[artist];
      artistCounts[artist] = artistCount ? artistCount + 1 : 1;
      return artistCounts;
    }, {});
    chart = {
      type: "bar",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
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
					yAxes: [{
						type: 'linear',
						ticks: {
							precision: 0,
							min: 0
						},
						scaleLabel: {
							labelString: 'Tracks',
							display: true
						}
					}]
				}
      }
    };
  }
</script>

<Chart {chart} title="Artists over time" />
