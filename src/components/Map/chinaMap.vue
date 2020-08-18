<template>
  <div>
    <baidu-map
      class="bm-view"
      :center="{lng:116.404035, lat:39.916322 }"
      :zoom="zoom"
      @ready="handler"
      :scroll-wheel-zoom="true"
      :mapClick="false"
    >
      <!--地图类型-->
      <bm-control class="select">
        <el-select v-model="schoolStyle" placeholder="请选择">
          <el-option
            v-for="item in schoolType"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
      </bm-control>
      <bm-map-type
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
      ></bm-map-type>
      <!--地图缩放-->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <!--标注点  animation="BMAP_ANIMATION_BOUNCE"-->
      <div v-for="marker in markers" :key="marker.lng">
        <bm-marker
          dragging
          :position="{lng: marker.lng, lat: marker.lat}"
          @click="markerClick(marker)"
          :icon="{url: 'http://api0.map.bdimg.com//images/hd_red_marker.png', size: {width: 20, height: 20}}"
        ></bm-marker>
        <bm-label
          :content="marker.content"
          :offset="{width:-55,height:-65}"
          :position="{lng: marker.lng, lat: marker.lat}"
          :labelStyle="{border:'1px solid #6ea4cd', padding:'8px',fontWeight: '500',fontSize:'14px',cursor: 'pointer'}"
          :title="marker.content"
          @click="markerClick(marker)"
        />
      </div>
    </baidu-map>
  </div>
</template>
<script>
  export default {
    props:{
      mapData:{
        type:Array
      }
    },
    data () {
      return {
        zoom: 5,
        index:1,
        show:true
      }
    },
    computed:{
      markers(){
          return this.mapData;
      }
    },
    created(){
    },
    mounted(){
      // this.markers = this.mapData;
      // console.log(this.markers,"--------------")
    },
    methods: {
      draw ({el, BMap, map}) {
        const pixel = map.pointToOverlayPixel(new BMap.Point(116.404035, 39.916322))
        el.style.left = pixel.x - 60 + 'px'
        el.style.top = pixel.y - 20 + 'px'
      },
      handler ({BMap, map}) {
        // console.log(arguments)
        // 自动获取展示的比例
        var view = map.getViewport(eval(this.markers))
        this.zoom = this.index == 1 ?  this.zoom : view.zoom;
        this.center = view.center;
      },
      markerClick(){
        this.show = true
      },
      infoWindowClose(){
        this.show = false
      }
    },
    // destroyed() {

    // },
  }
</script>

<style>
.bm-view {
  width: 100%;
  height: calc(100vh - 60px);
}
.select{
  margin: 20px;
}
.sample {
  width: 160px;
  height: 60px;
  background: rgba(255, 255, 255, 0.5);
  overflow: auto;
  color: #000000;
  text-align: center;
  padding: 10px;
  position: relative;
}
.BMap_Marker BMap_noprint {
  display: none;
}
</style>

