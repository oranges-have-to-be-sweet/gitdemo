<template>
  <div id="statics">
    <div class="topline">
      <div class="block">
        <el-date-picker value-format="yyyy-MM" class="w180x dib" v-model="time" :clearable="false" type="month" size="mini" placeholder="选择日期"></el-date-picker>
      </div>
    <el-select size="mini" class="w180x dib ml" v-model="schoolId"  placeholder="请选择">
      <el-option v-for="item in options" :key="item.id" :label="item.schoolName" :value="item.id"></el-option>
    </el-select>
    <el-button class="dib ml mb mleft" size="mini" @click="getData">查询</el-button>
    </div>
    <div class="mt">
      <chart v-if="chartData" width="80%" :chartData="chartData" height="600px"></chart>
      <div v-else class="nullData">暂无数据</div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="status1" align="center" label="已入园（人）" > </el-table-column>
      <el-table-column prop="status2" align="center" label="未入园（人）" > </el-table-column>
      <el-table-column prop="status3" align="center" label="拒收（人）" > </el-table-column>
      <el-table-column prop="sumStatus" align="center" label="总计（人）" > </el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from "@/api";
import chart from '@/components/Charts/pieChart' 
import { mapState } from "vuex";
export default {
  name: "Principal",
  components:{
    chart
  },
  data() {
    return {
      tableData:[],
      time:"" , //日期选择器月份
      schoolName:"",
      step:0,
      schoolId:'',
      options:[],
      chartData:[]
    };
  },
  computed: {

  },
  created(){
    this.getOptions();
  },
  mounted() {
    let date = new Date();
    let num  = Number(date.getMonth() + 1) > 10 ? Number(date.getMonth() + 1) : '0'+ Number(date.getMonth() + 1)
    var str = date.getFullYear() + "-" + num;
    this.time = str;
    this.step = 1 ; 
    this.getOptions().then((res) => {
      this.schoolId = res.data[res.data.length-1].id
      this.step = 2 ; 
      this.getData()
    });
  },
  methods: {
    getData(){
      let params = {startTime:this.time,schoolId:this.schoolId};
      if(this.time == '' ||  this.schoolid == ''){
        this.$message({
          message:"请选择日期和学校"
        })
        return
      }
      api.visualPack.getStudentsView(params).then((res) => {
        if(res.status == 200){
          console.log('-----------招生情况---------',res.data)
          let arr = [
            {
              name:'已入园',
              value:res.data[0].status1?res.data[0].status1:'0'
            },
            {
              name:'未入园',
              value:res.data[0].status2?res.data[0].status2:'0'
            },
            {
              name:'拒收',
              value:res.data[0].status3?res.data[0].status3:'0'
            }
          ];
          this.chartData = arr;
          this.tableData = res.data
        }
      })
    },
    getOptions(){
      return new Promise((reslove,reject)=>{
        let params = {
          userid:Number(sessionStorage.getItem('userId')),
          compId:Number(sessionStorage.getItem('companyId')),
          schoolStyle:1
        }
        api.global.getParkSelectApi(params).then((res) => {
          if(res.status){
            console.log('-----------学校列表---------',res)
            this.options = res.data;
            reslove(res)
          }
        })
      })
    },
  },
};
</script>

<style scoped lang="scss">
  .topline{
    display: flex;
  }
  .block{
    max-width:50%;
  }
  .mleft{
    margin-left: 16px;
  }
  .nullData{
  height: 500px;
  line-height: 500px;
  width: 100%;
  text-align: center;
  font-size: 16px;
}
</style>
