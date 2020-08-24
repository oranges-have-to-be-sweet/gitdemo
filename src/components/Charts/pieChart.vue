<template>
  <div
    id="piechart"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>
<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
// import resize from './mixins/resize'

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "400px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      window.addEventListener("resize", this.resizeChart);
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      const loading = this.$loading({
        lock: true,
        text: "Loading...",
        spinner: "el-icon-loading",
        target: "#piechart"
      });
      // console.log(this.chartData);
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    resizeChart(data) {
      if (this.chart) {
        this.chart.resize();
      }
    },
    setOptions(data) {
      console.log(data);
      this.chart.setOption({
        series: [
          {
            type: "pie",
            radius: "80%",
            center: ["50%", "45%"],
            data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
        tooltip: {
          trigger: "item"
        },
        legend: {
          bottom: 10,
          icon: "circle",
          left: "center"
        }
      });
    }
  }
};
</script>
