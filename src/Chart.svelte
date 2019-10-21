<script>
  import Chart from "chart.js";

  export let chart = {};
  export let title = "";

  let canvas;

  $: {
    if (canvas) {
      new Chart(canvas.getContext("2d"), chart);
    }
  }
</script>

<style>
  .graph-container {
    height: 400px;
    position: relative;
  }

  h2 {
    margin-bottom: 1rem;
  }

  .container {
    margin-bottom: 1rem;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
  }
</style>

<div class="container">
  <div class="title-container">
    <h2>{title}</h2>
    <slot name="controls" />
  </div>
  <div class="graph-container">
    <canvas bind:this={canvas} />
  </div>
</div>
