<script>

import { Pie } from 'vue-chartjs'

export default {
    extends: Pie,
    props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
    },
    watch: {
      chartdata () {

        this.renderChart(this.chartdata, this.options)
      }
    },
    mounted: function() {
        this.renderChart(this.chartdata, this.options)
    }

}
</script>

