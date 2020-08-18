<template>
  <div id="statics">
    <el-date-picker value-format="yyyy-MM" class="w180x dib" v-model="time" type="month" :clearable="false" size="mini" placeholder="选择日期"></el-date-picker>
    <el-select size="mini" class="w180x dib ml mr" v-model="schoolid" placeholder="请选择">
      <el-option v-for="item in options" :key="item.id"  align="center" :label="item.schoolName" :value="item.id"></el-option>
    </el-select>
    <el-button class="dib ml mb" size="mini" @click="getData">查询</el-button>
    <div v-if="chartData.length>0" class="mt map">
      <!-- <chart :mapData="data" ></chart> -->
      <chart  v-if="chartData" width="100%" :chartData="chartData" height="600px"></chart>
      <div v-else class="nullData">暂无数据</div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="loginName" align="center" label="老师名称" > </el-table-column>
      <el-table-column prop="should" align="center" label="应出勤（天）" > </el-table-column>
      <el-table-column prop="thing" align="center" label="事假（天）" > </el-table-column>
      <el-table-column prop="disease" align="center" label="病假（天）" > </el-table-column>
      <el-table-column prop="other" align="center" label="其他假（天）" > </el-table-column>
      <el-table-column prop="actual" align="center" label="实际出勤（天）" > </el-table-column>
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
      time:"",
      schoolid: '',
      chartData:[],
      tableData:[],
      options:[],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      let date = new Date();
      let num  = Number(date.getMonth() + 1) > 10 ? Number(date.getMonth() + 1) : '0'+ Number(date.getMonth() + 1)
      var str = date.getFullYear() + "-" + num;
      this.time = str;
      this.getOptions().then((res) => {
        this.schoolid = res.data[res.data.length-1].id
        this.getData()
      });
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
    getData(){
      let params = {startTime:this.time,schoolId:this.schoolid};
      if(this.time == '' ||  this.schoolid == ''){
        this.$message({
          message:"请选择日期和学校"
        })
        return
      }
      api.visualPack.getDetailsToTeacher(params).then((res) => {
        if(res.status == 200){
          let arr = [
            {value: res.data.disease || 0, name: '请假率'},
            {value: res.data.attendanceDay || 0 , name: '出勤率'},
          ]
          this.chartData = arr
          this.tableData = res.data.teacherList
        }
      })
    },
  },
};
</script>

<style scoped lang="scss">
.map{
  height: 600px;
  width: 100%;
}
.mb{
  margin-bottom: 10px;
}
.nullData{
  height: 500px;
  line-height: 500px;
  width: 100%;
  text-align: center;
  font-size: 16px;
}
</style>
