<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: {
    tracks: {
      required: true,

    }
  },
  computed: {
    data() {
      return this.tracks.reduce((tracks, track, index) => {
        if (track.added_at !== '1970-01-01T00:00:00Z') {
          return [...tracks, {
            x: new Date(track.added_at),
            y: index,
          }];
        }
        return tracks;
      }, []);
    },
  },
  watch: {
    tracks: 'render',
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      this.renderChart({
        datasets: [{
          data: this.data,
        }],
      }, {
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
          }],
        },
      });
    },
  },
};
</script>
