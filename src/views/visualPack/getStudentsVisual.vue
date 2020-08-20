<template>
  <div id="statics">
    <div class="topMoudule">
      <el-date-picker value-format="yyyy-MM" class="w180x dib" v-model="time" :clearable="false" type="month" size="mini" placeholder="选择日期"></el-date-picker>
      <el-select size="mini" class="w180x dib ml mr" v-model="schoolStyle" placeholder="请选择">
        <el-option v-for="item in schoolType" :key="item.id"  align="center" :label="item.label" :value="item.id"></el-option>
      </el-select>
      <el-select size="mini" class="w180x dib ml" v-model="schoolId"  placeholder="请选择">
        <el-option v-for="item in options" :key="item.id" :label="item.schoolName" :value="item.id"></el-option>
      </el-select>
      <el-button class="dib" size="mini" @click="getData">查询</el-button>
    </div>
    <el-row class="layout-row">
      <el-col :span="10" :offset="1">
        <div class="mt">
          <chart v-if="chartData" width="80%" :chartData="chartData" height="600px"></chart>
          <div v-else class="nullData">暂无数据</div>
        </div>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-table :data="tableData"
          border
          :row-style="{ height: columnHeight }"
          :style="{
            width: '100%',
            height:tableHeight+'px',
            overflow:'auto'
          }">
          <el-table-column prop="schoolName" align="center" label="学校名字" > </el-table-column>
          <el-table-column prop="alreadyEntered" align="center" label="已入园（人）" > </el-table-column>
          <el-table-column prop="notEntered" align="center" label="未入园（人）" > </el-table-column>
          <el-table-column prop="rejection" align="center" label="拒收（人）" > </el-table-column>
          <el-table-column prop="badLuck" align="center" label="总计（人）" > </el-table-column>
        </el-table>
        <Pagination v-if="total > 0" :total="total"  @pagination="getData" :page.sync="dataQuery.pageNum" :limit.sync="dataQuery.pageSize"></Pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from "@/api";
import chart from '@/components/Charts/pieChart' 
import { mapState } from "vuex";
import Pagination from '@/components/pagination';
export default {
  name: "Principal",
  components:{
    chart,
    Pagination
  },
  data() {
    return {
      total:0,
      tableData:[],
      time:"" , //日期选择器月份
      schoolName:"",
      step:0,
      schoolId:'',
      options:[],
      chartData:[],
      schoolStyle:3,
      dataQuery:{
        compId:Number(sessionStorage.getItem('companyId')),
        startTime:'',
        schoolId:'',
        schoolStyle:1,
        pageNum:1,
        pageSize:10
      },
    };
  },
  computed:{
    ...mapState({
      schoolType: state => state["global"].schoolType, 
    }),
    tableHeight() {
     return 550;
    },
    columnHeight() {
      return (this.tableHeight - 60) / 10 + "px";
    },
    pageHeight(){
      if(window.innerHeight > 1336){
        return window.innerHeight - 50;
      }else{
        return window.innerHeight - 50;
      }
    }
  },
  watch:{
    schoolStyle:{
      handler(val){
        this.options = [];
        this.schoolId = 0;
        this.getOptions()
      },
      immediate:true
    }
  },
  created(){
    this.getOptions();
  },
  mounted() {
    let date = new Date();
    let num  = Number(date.getMonth() + 1) > 10 ? Number(date.getMonth() + 1) : '0'+ Number(date.getMonth() + 1)
    var str = date.getFullYear() + "-" + num;
    this.time = str;
    this.dataQuery.startTime = this.time;
    this.step = 1 ; 
    this.getOptions().then((res) => {
      this.schoolId = this.options[0].id
      this.dataQuery.schoolId = this.schoolId
      this.step = 2 ; 
      this.getData()
    });
  },
  methods: {
    getData(){
      let params = {...this.dataQuery};
      params.startTime = this.time+'-01'
      params.schoolStyle = this.schoolStyle
      params.schoolId = this.schoolId
      if(this.time == ''){
        this.$message({
          message:"请选择日期和学校"
        })
        return
      }
      api.global.getSelectGetStuApi(params).then((res) => {
        console.log(res.data);
        if(res.status == 200){
          console.log('-----------招生情况---------',res.data)
          let arr = [
            {
              name:'已入园',
              value:res.data.alreadyEntered?res.data.alreadyEntered:'0'
            },
            {
              name:'未入园',
              value:res.data.notEntered?res.data.notEntered:'0'
            },
            {
              name:'拒收',
              value:res.data.rejection?res.data.rejection:'0'
            }
          ];
          this.chartData = arr;
          this.tableData = res.data.info;
          this.total = res.data.total;
          this.dataQuery.pageNum = res.data.pageNum;
          this.dataQuery.pageSize = res.data.pageSize;
        }
      })
    },
    getOptions(){
      return new Promise((reslove,reject)=>{
        let params = {
          userid:Number(sessionStorage.getItem('userId')),
          compId:Number(sessionStorage.getItem('companyId')),
          schoolStyle:this.schoolStyle
        }
        api.global.getParkSelectApi(params).then((res) => {
          if(res.status == 200){
            console.log('-----------学校列表---------',res.data)
            let arr = Object.assign([],res.data);
            arr.unshift({
              id: 0,
              schoolName:'全部'
            });
            this.options = arr;
            reslove(res)
          }
        })
      })
    },
  },
};
</script>

<style scoped lang="scss">
  .layout-row{
    .el-col{
      height:632px;
      padding:20px;
      border-radius:8px;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 30px 0px rgba(0, 0, 0, 0.1);
      border:2px solid rgba(255,255,255,1);
    }
  }
  .topline{
    display: flex;
  }
  .topMoudule{
    margin: 20px 0 40px 56px;
    *{
      margin: 0 20px;
    }
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
