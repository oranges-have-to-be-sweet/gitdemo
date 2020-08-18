<template>
  <div :name="lang" :class="className" :style="{height:height,width:width}" />
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
      default: '380px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
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
    setOptions(data ) { 
      let index = 0 ;
      let date = [] ;
      let series = []
      for( let key  in data ){
        date.push(key)
        if(index == 0){
          let iindex = 0
          for( let item in data[key] ){
            series.push({
              name:item,
              type:'line',
              stack: '总量',
              areaStyle: this.setAreaStyle(iindex),
              data:[]
            })
            iindex ++ 
          }
        }
        index ++ 
      }  
      for (let i = 0; i < series.length; i++) {
        for( let key  in data ){
          for( let el in data[key]){
            if(series[i].name == el){
              series[i].data.push(data[key][el])
            }
          }
        }
      }  
      let legend = []
      for (var i = 0; i < series.length; i++) {
        legend.push(series[i].name)
      }
       
      this.chart.setOption({
        color:this.color,
        textStyle:{
          color:"#333333"
        },
        xAxis: {
          name:'时间' ,
          nameLocation:"end",
          nameTextStyle:{
            fontSize:14,
            color:"#999999",
          },
          data:date, 
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 50,
          bottom: 20,
          top: 20,
          containLabel: true
        },
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
              type: 'line',
              axis: "x",
              lineStyle:{
                  color:"#64D9FF",
                  type:"dashed"
              },
          },
          extraCssText: 'z-index:1',
          backgroundColor:"#ffffff",
          textStyle:{
            color:"#333333"
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        // legend: {
        //   orient:"horizontal",//horizontal /vertical
        //   right:0,
        //   top:10,
        //   align:"left",
        //   data:legend,
        // },
        series:series
      })
    }
  }
}
</script>
<style  scoped>
.tst{
  padding-top: 5px;
  padding-bottom: 5px; 
}
</style>