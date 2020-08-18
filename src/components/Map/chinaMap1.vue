<template>
  <div>
    <el-input size="mini" v-model="address" placeholder="请选择园区地址" @focus="mapCpm">请选择校区地址</el-input>
    <el-dialog :modal-append-to-body="true"
              :close-on-click-modal="false"
               :title="textMap[dialogStatus]"
               :visible.sync="mapCPM">
      <baidu-map class="map"
                 :center="center"
                 :zoom="zoom"
                 @ready="handler"
                 :double-click-zoom='false'
                 :scroll-wheel-zoom='true'
                 @click="clickBaiDuMap">
        <bm-view class="map"></bm-view>
        <bm-control :offset="{width: '10px', height: '10px'}">
          <bm-auto-complete v-model="keyword"
                            :sugStyle="{zIndex: 0}">
            <el-input placeholder="请输入地名关键字"
                      v-model="keyword"></el-input> <!-- 这里指代一个自定义搜索框组件 -->
            <bm-local-search :keyword="keyword"
                             :auto-viewport="true"
                             @markersset="setPoint"
                             style="width:0px;height:0px;opacity:0"></bm-local-search>
          </bm-auto-complete>
        </bm-control>

        <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
                        :showAddressBar="true"
                        :autoLocation="true"
                        @locationSuccess='locationSuccess'></bm-geolocation> -->
        <bm-marker :position="locationdata.center"
                   @dragend="dragend"
                   :raiseOnDrag='true'
                   :dragging='true'
                   class="Memarker"
                   :icon="{url: pointIcon, size: {width: 30, height: 30}}">
        </bm-marker>
      </baidu-map>
      <el-row class="map_title">
        <el-col :span="12"
                class="map_title_span">
          <p class="map_p">经度：{{locationdata.center ? locationdata.center.lng : center.lng}}</p>
          <p class="map_p">纬度：{{locationdata.center ? locationdata.center.lat : center.lat}}</p>
        </el-col>
        <el-col :span="12">
          <div style="display:flex;justify-content: flex-end;">
            <div>
              <p v-if="switchEdit">地址：<span>{{locationdata.addr || '请标注地址'}}</span></p>
              <div v-else class="addressDom">
                <p style="width:60px;">地址：</p>
                <el-input size="mini" v-model="locationdata.addr"></el-input>
              </div>
            </div>
            <div @click="switchEdit=!switchEdit">
              <el-button v-if="switchEdit" style="margin-left:20px;" type="text" icon="el-icon-edit"></el-button>
              <el-button v-else style="margin-left:20px;" type="text">保存</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="12" :span="4">
          <el-button type="primary" size="small"  @click="getmapdamodata">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props:{
    mapData:{
      type:Object
    }
  },
  data () {
    return {
      switchEdit:true,
      pointIcon:require('../../assets/point.png'),
      keyword: '',
      city: '',//输入框搜索内容
      address:'',
      address_detail: null, //详细地址
      fullscreenLoading: false,//地图加载动画
      // 地图初始化的位置
      center: { lng: 113.18088529892, lat: 23.460952009562 },
      // 地图内的大小
      zoom: 15,
      // 这个是搜索下的东西
      location: '',
      // 这个是选择搜索列表中数据的title以及经纬度
      locationdata: {
        title: '',
        center: '',
        addr: ''//地址
      },
      geolocation: "",
      BMap: '',
      textMap: {
        map: '请在地图上标注园区位置'
      },
      dialogStatus: 'map',
      mapCPM: false,
      inputaddr: ''
    }
  },
  mounted () {
    // console.log(this.mapData,'父传子');
    this.address = this.mapData.address;
  },
  watch:{
    'mapData':{
      handler(val,oldval){
        console.log(val,oldval);
        this.address = val.address
      }
    }
  },
  methods: {
    // 由于百度地图 JS API 只有 JSONP 一种加载方式，因此 BaiduMap 组件及其所有子组件的渲染只能是异步的。因此，请使用在组件的 ready 事件来执行地图 API 加载完毕后才能执行的代码，不要试图在 vue 自身的生命周期中调用 BMap 类，更不要在这些时机修改 model 层。
    handler ({ BMap, map }) {
      window.map = map; //注册为全局
      var that = this;  // map方法中的this指向不对。所有申明一个。。小细节的东西
      // 刚进入页面中的定位，需要向用户授权
      var geolocation = new BMap.Geolocation();
      console.log(geolocation,'111111111')
      this.geolocation = geolocation;
      geolocation.getCurrentPosition(() => {
        // console.log('data')
        // alert('nimamaipi')
      })
      geolocation.enableSDKLocation();
      geolocation.getCurrentPosition(function (r) {

        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          // 把得到的经纬度传给map，就实现了第一步我们的定位
          that.center = {
            lng: r.point.lng,
            lat: r.point.lat
          }
          console.log("wang", r)

          var a = r.address.city
          var b = r.address.district
          var c = r.address.province
          var d = r.address.street
          var e = r.address.street_number

          // console.log(a);
          // console.log(b);
          // console.log(c);
          // console.log(d);
          // console.log(e);

          var f = ''
          //this.locationdata.addr = ''
          f = a + b + c + d + e
          window.title = f;//注册为全局
          // this.locationdata.addr = f
          console.log(f);
          // this.locationdata.addr = r.address.city + r.address.district + r.address.province + r.address.street + r.address.street_number
          //   当用户拒绝该授权的时候，依然执行
          if (r.accuracy == null) {
            // alert('accuracy null:'+r.accuracy);
            //用户决绝地理位置授权
            return;
          }
        } else {
          console.log('failed' + this.getStatus());
        }
      }, { enableHighAccuracy: true })
      this.BMap = BMap;
    },
    setPoint(list){
      console.log(list);
      list.map(item=>{});
    },
    mapCpm () {
      //打开地图弹窗
      if (window.title != '' && window.title != null) {
        this.locationdata.addr = window.title
        window.title = ''
      }

      console.log(window.title);

      this.dialogStatus = 'map'
      this.$nextTick(() => {
        this.mapCPM = true
      })
    },
    // locationSuccess (point, AddressComponent, marker) {
    //   //定位成功后
    //   console.log(point,'point');
    //   this.locationdata.center = point.point
    //   this.locationdata.addr = point.addressComponent.city + point.addressComponent.district + point.addressComponent.province + point.addressComponent.street + point.addressComponent.streetNumber
    //   this.center = point.point
    // },
    //   选择localtion的值
    // getlocalsearch (e) {
    //   this.locationdata.title = e.address + e.title;
    //   this.locationdata.center = e.point;
    // },
    dragend (type, target, pixel, point) { //拖拽结束触发
      this.locationdata.center = type.point;
      // this.position = type.point
      const _this = this
      const gc = new this.BMap.Geocoder()
      gc.getLocation(type.point, function (rs) {
        console.log("aaaaaaaaaaaaaaa", rs)
        _this.locationdata.addr = rs.address
      })
    },
    // 确定该信息然后存在session中
    getmapdamodata() {
      // console.log(this.locationdata,'1111111111111111');
      this.inputaddr = this.locationdata.addr
      this.mapCPM = false;
      this.$emit('getPoint',this.locationdata)
      this.address = this.locationdata.addr;
    },
    clickBaiDuMap (type, target, point, pixel, overlay) {
      console.log(type);
      console.log(target); console.log(point); console.log(pixel); console.log(overlay);
      this.locationdata.center = type.point;
      // this.center = type.point
      // this.position = type.point
      const _this = this
      const gc = new this.BMap.Geocoder()
      gc.getLocation(type.point, function (rs) {
        console.log("aaaaaaaaaaaaaaa", rs)
        _this.locationdata.addr = rs.address
      })
    },


  }
} 
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 500px;
  // /deep/.BMap_Marker{
  //   width: 30px;
  //   height: 30px;
  // }
  // /deep/.Memarker{
  //   display: block !important;
  // }
}
.anchorBL {
  display: none;
}
.map_title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.1533rem;
}
.addressDom{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.map_title_span{
  display: flex;
}
.map_p{
  margin: 10px;
}
</style>