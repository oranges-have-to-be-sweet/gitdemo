<template>
  <div id="statics">
    <div class="topMoudule">
      <el-date-picker class="w180x dib" v-model="time" type="month" value-format="yyyy-MM" :clearable="false" size="mini" placeholder="选择日期" ></el-date-picker>
      <el-select size="mini" class="w180x dib ml mr" v-model="schoolStyle" placeholder="请选择">
        <el-option v-for="item in schoolType" :key="item.id"  align="center" :label="item.label" :value="item.id"></el-option>
      </el-select>
      <el-select size="mini" class="w180x dib ml" v-model="schoolId" placeholder="请选择" >
        <el-option v-for="item in options" :key="item.id"  :label="item.schoolName" :value="item.id"></el-option>
      </el-select>
      <el-button class="dib ml mb" size="mini" @click="getToStudent">查询</el-button>
    </div>
    <el-row>
      <el-col :span="11" :offset="1">
        <div class="mt">
          <chart v-if="chartData.length" width="100%" :chartData="chartData" height="600px"></chart>
          <div v-else class="nullData">暂无数据</div>
        </div>
      </el-col>
      <el-col :span="11">
        <el-table :data="tableData" border style="width:100%">
          <el-table-column prop="className" align="center" label="班级名称"> </el-table-column>
          <el-table-column prop="should" align="center" label="应出勤（次）"> </el-table-column>
          <el-table-column prop="absence" align="center" label="缺勤（次）"> </el-table-column>
          <el-table-column prop="actual" align="center" label="实际出勤（次）"> </el-table-column>
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
      time:"",
      schoolId:"",
      step:0,
      options:[],
      chartData:[],
      tableData:[],
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
  mounted() {
    let date = new Date();
    let num  = Number(date.getMonth() + 1) > 10 ? Number(date.getMonth() + 1) : '0'+ Number(date.getMonth() + 1)
    var str = date.getFullYear() + "-" + num;
    this.time = str;
    this.step = 1;
    this.getOptions().then((res) => {
      this.schoolId = res.data[0].id
      this.step = 2 ; 
      this.getToStudent()
    });
  },
  methods: {
    getOptions(){
      return new Promise((reslove,reject)=>{
        let params = {
          userid:Number(sessionStorage.getItem('userId')),
          compId:Number(sessionStorage.getItem('companyId')),
          schoolStyle:this.schoolStyle
        }
        api.global.getParkSelectApi(params).then((res) => {
          if(res.status){
            console.log('-----------学校列表---------',res);
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
    getToStudent(){
      if(this.time == '' && this.schoolId == ''){
        this.$message({
          message:"请选择日期和学校"
        })
        return
      }else{
        let params = {
          compId:Number(sessionStorage.getItem('companyId')),
          schoolId:this.schoolId,
          startTime:this.time + '-01',
          schoolStyle:this.schoolStyle,
          pageNum:1,
          pageSize:10
        }
        api.global.getSelectStuKqApi(params).then((res) => {
        if(res.status){
          console.log('-----------学生考勤---------',res.data)
          let arr = [
            {name:'出勤率',value:res.data.attendanceDay || 0},
            {name:'缺勤率',value:res.data.disease || 0}
          ]
          console.log(arr)
          this.chartData=arr;
          this.tableData=res.data.info.list;
        }
      })
      }
      
    },
    getPickData(){
      this.step++;
      console.log(this.time,this.step)
      if(this.step>=2){
        return this.getToStudent()
      }
    },
    getSelectData(){
      this.step++;
      console.log(this.schoolId,this.step)
      if(this.step>=2){
        return this.getToStudent()
      }
    }
  },
};
</script>

<style scoped lang="scss">
.map{
  height: 600px;
  width: 100%;
}
.topMoudule{
  margin: 20px 0 40px 40px;
  *{
    margin: 0 20px;
  }
}
.mb{
  margin-bottom: 10px;
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
