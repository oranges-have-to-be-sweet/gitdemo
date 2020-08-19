<template>
  <div>
    <baidu-map
      class="bm-view"
      :center="{lng:116.404, lat:39.916 }"
      :zoom="zoom"
      @ready="handler"
      :scroll-wheel-zoom="true"
      :mapClick="false"
    >
      <!--地图类型-->
      <bm-control class="select">
        <el-select v-model="schoolStyle" placeholder="请选择" @change="getData">
          <el-option
            v-for="item in schoolType"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
        <div class="bname">
          <p>快教务共计 <span>{{otherData.kjw}} 所</span> ，</p>
          <p>育幼通  <span>{{otherData.yyt}} 所</span> ，</p>
          <p>全部学校共  <span>{{otherData.suoYou}} 所</span> </p>
        </div>
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
          :position="{lng: marker.lng, lat: marker.lat}"
          :icon="{url: 'http://api0.map.bdimg.com//images/hd_red_marker.png', size: {width: 40, height: 50}}"
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
  import api from '@/api';
  export default {
    props:{
      mapData:{
        type:Array
      }
    },
    data () {
      return {
        otherData:'',
        zoom: 5,
        index:1,
        show:true,
        markers:[],
        schoolStyle:0,
        schoolType:[
          {
            label:'全部',
            id:0
          },
          {
            label:'育幼通',
            id:1
          },
          {
            label:'快教务',
            id:2
          }
        ]
      }
    },
    mounted(){
      this.getData();
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
      },
      getData(){
        let load = this.$loading({
          target:document.querySelector('.bm-view'),
          text:'加载中...'
        })
        let params = {
          compId:sessionStorage.getItem('companyId')
        }
        if(this.schoolStyle) params.schoolStyle = this.schoolStyle;
        api.global.getAllLngLatListApi(params).then((res) => {
          if( res.status == 200 ){
            console.log('----获取园区信息----',res.data);
            this.otherData = {
              kjw:res.data.kjw,
              suoYou:res.data.suoYou,
              yyt:res.data.yyt
            }
            if(res.data.school.length){
              this.markers = res.data.school.map(item => {
                return {
                  lat:Number(item.latitude),
                  lng:Number(item.longitude),
                  content:item.schoolName || ""
                }
              })
            };
            load.close();
          }
        })
      },
    },
  }
</script>

<style >
.bm-view {
  width: 100%;
  height: calc(100vh - 60px);
}
.select{
  width: 100%;
  margin: 20px;
  display: flex;
  justify-content: space-between;
  padding-right: 120px;
}
.bname{
  display: flex;
  background-color: #f8f8f8;
  border-radius: 5px;
  font-size: 13px;
  overflow: hidden;
  padding: 0px 10px;
}
.bname p{
  margin: 0px;
  float: left;
  height: 40px;
  line-height: 40px;
}
.bname p span{
  color:rgba(60, 130, 255, 1) ;
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

