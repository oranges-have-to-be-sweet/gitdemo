<template>
  <div id="statics">
    <div class="mt map">
      <chart />
    </div>
  </div>
</template>
<script>
import api from "@/api";
import chart from "@/components/Map/chinaMap";
// eslint-disable-next-line no-unused-vars
import { mapState } from "vuex";
export default {
  name: "",
  components: {
    chart
  },
  data() {
    return {
      mapData: [],
      otherData: ""
    };
  },
  mounted() {
    // this.getData();
  },
  methods: {
    getData() {
      const params = {
        compId: sessionStorage.getItem("companyId")
      };
      if (this.schoolStyle) params.schoolStyle = this.schoolStyle;
      api.global.getAllLngLatListApi(params).then(res => {
        if (res.status === 200) {
          console.log("----获取园区信息----", res.data);
          if (res.data.length) {
            this.mapData = res.data.map(item => {
              return {
                lat: Number(item.latitude),
                lng: Number(item.longitude),
                content: item.schoolName || ""
              };
            });
          } else {
            this.mapData = [];
            // this.$message({type:'warning',message:'当前没有定位的园区'});
          }
          // console.log( 'yyt',this.mapData)
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.map {
  height: 500px;
  width: 100%;
}
.mb {
  margin-bottom: 10px;
}
</style>
