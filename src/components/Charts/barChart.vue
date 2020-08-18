<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '400px'
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
    setOptions(data) {
      console.log(data)
      this.chart.setOption( {
            title: {
                text: '招生情况一览',
                left:'50%',
                textStyle: {    
                  color: "#555",
                  fontSize: 17,   
                }
            },
            tooltip: {
                 trigger: "axis",
            },
            legend: {
                itemWidth:10,  
                itemHeight:10,
                data:['已拒绝','已注册','待处理'],
            },
            xAxis: {
                data: chartData.length,
                splitLine:{
                    show:false,
                },
            },
            yAxis: {
                 splitLine:{
                    show:false,
                },
            },
            series: [{
                type: 'bar',
                stack:'num',
                data: [5, 20, 36, 10, 10, 20],
                itemStyle:{
                     normal:{color:"#FF8849"},
                }
            },{
                type: 'bar',
                stack:'num',
                data: [40, 22, 18, 35, 42, 40],
                itemStyle:{
                     normal:{color:"#3FBB49"},
                }
            },{
                type: 'bar',
                stack:'num',
                data: [40, 22, 18, 35, 42, 40],
                itemStyle:{
                     normal:{color:"#ccc"},
                }
            }]
        })
    }
  }
}

</script>
