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
    <el-row>
      <el-col :span="11" :offset="1">
        <div class="mt">
          <chart v-if="chartData" width="80%" :chartData="chartData" height="600px"></chart>
          <div v-else class="nullData">暂无数据</div>
        </div>
      </el-col>
      <el-col :span="11">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="alreadyEntered" align="center" label="已入园（人）" > </el-table-column>
          <el-table-column prop="notEntered" align="center" label="未入园（人）" > </el-table-column>
          <el-table-column prop="rejection" align="center" label="拒收（人）" > </el-table-column>
          <el-table-column prop="badLuck" align="center" label="总计（人）" > </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
      chartData:[],
      schoolStyle:1
    };
  },
  computed:{
    ...mapState({
      schoolType: state => state["global"].schoolType, 
    }) 
  },
  watch:{
    schoolStyle:{
      handler(val){
        this.options = [];
        this.schoolId = '';
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
    this.step = 1 ; 
    this.getOptions().then((res) => {
      this.schoolId = res.data[0].id
      this.step = 2 ; 
      this.getData()
    });
  },
  methods: {
    getData(){
      let params = {
        compId:Number(sessionStorage.getItem('companyId')),
        schoolId:this.schoolId,
        startTime:this.time + '-01',
        schoolStyle:this.schoolStyle,
        pageNum:1,
        pageSize:10
      };
      if(this.time == '' ||  this.schoolid == ''){
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
          this.tableData = res.data.info.list;
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
  .topline{
    display: flex;
  }
  .topMoudule{
    margin: 20px 0 40px 40px;
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
