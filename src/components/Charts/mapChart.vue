<template>
  <div :name="lang" :class="className" :style="{height:height,width:width}" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { areaMap } from './mixins/mapArea'
import '../../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '380px'
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
      chart: null,
    }
  },
  computed:{
    lang(){
      this.$nextTick(() => {
        this.initChart()
      })
      return this.$store.getters.language
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      var data = areaMap(chartData)
      this.chart.setOption({
        title:{
          text:'园区分布图',
          textStyle:{
            fontSize:13,
            color:"#333333",
            fontWeight:"bold"
          },
          bottom:20
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          orient:"horizontal",
          type:"piecewise",
          itemSymbol:"roundRect",
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          min:0,
          max:1000,
          inverse:true
        },
        series: [{
          name: '园所',
          type: 'map',
          mapType: 'china',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          data
        }]
      })
    }
  }
}

</script>
