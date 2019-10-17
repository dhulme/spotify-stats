<script>
	import { onMount } from "svelte";
	import Chart from './Chart.svelte';

  export let tracks;

  let chart;

  $: {
    chart = {
      type: "scatter",
      data: {
        datasets: [
          {
            data: tracks.reduce((tracks, track, index) => {
              if (track.added_at !== "1970-01-01T00:00:00Z") {
                return [
                  ...tracks,
                  {
                    x: new Date(track.added_at),
                    y: index,
                    title: track.track.name + "\n" + track.track.artists[0].name
                  }
                ];
              }
              return tracks;
            }, []),
            fill: false,
            borderColor: "#209cee",
            backgroundColor: "#209cee"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  second: "ll"
                }
              },
              scaleLabel: {
                labelString: "Time added",
                display: true
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                labelString: "Track position",
                display: true
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            title([point], { datasets }) {
              return datasets[0].data[point.index].title;
            }
          }
        }
      }
    };
  }
</script>

<Chart {chart} title="Tracks over time" />
