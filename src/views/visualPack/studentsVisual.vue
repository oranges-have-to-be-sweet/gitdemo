<template>
  <div id="statics">
    <div class="topMoudule">
      <el-form inline label-position="right" label-width="80px" size="mini">
        <el-form-item label="日期：">
          <el-date-picker
            class="w180x dib"
            v-model="time"
            type="month"
            value-format="yyyy-MM"
            :clearable="false"
            size="mini"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学校类型：" label-width="100px">
          <el-select
            size="mini"
            class="w180x dib ml mr"
            v-model="schoolStyle"
            placeholder="请选择"
          >
            <el-option
              v-for="item in schoolType"
              :key="item.id"
              align="center"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校：">
          <el-select
            size="mini"
            class="w180x dib ml"
            v-model="schoolId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.schoolName"
              :value="item.id"
            ></el-option> </el-select
        ></el-form-item>
        <el-form-item>
          <el-button class="dib ml" @click="getToStudent">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="layout-row">
      <el-col :span="10" :offset="1">
        <div class="mt">
          <chart
            v-if="chartData.length"
            width="100%"
            :chartData="chartData"
            height="600px"
          ></chart>
          <div v-else class="nullData">暂无数据</div>
        </div>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-table
          :data="tableData"
          border
          :row-style="{ height: columnHeight }"
          :style="{
            width: '100%',
            height: tableHeight + 'px',
            overflow: 'auto'
          }"
        >
          <el-table-column prop="className" align="center" label="班级名称">
          </el-table-column>
          <el-table-column prop="should" align="center" label="应出勤（次）">
          </el-table-column>
          <el-table-column prop="absence" align="center" label="缺勤（次）">
          </el-table-column>
          <el-table-column prop="actual" align="center" label="实际出勤（次）">
          </el-table-column>
        </el-table>
        <Pagination
          v-if="total > 0"
          :total="total"
          @pagination="getToStudent"
          :page.sync="dataQuery.pageNum"
          :limit.sync="dataQuery.pageSize"
        ></Pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from "@/api";
import chart from "@/components/Charts/pieChart";
import Pagination from "@/components/pagination";
import { mapState } from "vuex";
export default {
  name: "Principal",
  components: {
    chart,
    Pagination
  },
  data() {
    return {
      total: 0,
      time: "",
      schoolId: "",
      step: 0,
      options: [],
      chartData: [],
      tableData: [],
      schoolStyle: 3,
      dataQuery: {
        compId: Number(sessionStorage.getItem("companyId")),
        startTime: "",
        schoolId: "",
        schoolStyle: 1,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    ...mapState({
      schoolType: state => state["global"].schoolType
    }),
    tableHeight() {
      return 550;
    },
    columnHeight() {
      return (this.tableHeight - 60) / 10 + "px";
    },
    pageHeight() {
      if (window.innerHeight > 1336) {
        return window.innerHeight - 50;
      } else {
        return window.innerHeight - 50;
      }
    }
  },
  watch: {
    schoolStyle: {
      handler(val) {
        this.options = [];
        this.schoolId = 0;
        this.getOptions();
      },
      immediate: true
    }
  },
  mounted() {
    let date = new Date();
    let num =
      Number(date.getMonth() + 1) > 10
        ? Number(date.getMonth() + 1)
        : "0" + Number(date.getMonth() + 1);
    var str = date.getFullYear() + "-" + num;
    this.time = str;
    this.dataQuery.startTime = this.time;
    this.step = 1;
    this.getOptions().then(res => {
      this.schoolId = this.options[0].id;
      this.dataQuery.schoolId = this.schoolId;
      this.step = 2;
      this.getToStudent();
    });
  },
  methods: {
    getOptions() {
      return new Promise((reslove, reject) => {
        let params = {
          userid: Number(sessionStorage.getItem("userId")),
          compId: Number(sessionStorage.getItem("companyId")),
          schoolStyle: this.schoolStyle
        };
        api.global.getParkSelectApi(params).then(res => {
          if (res.status) {
            console.log("-----------学校列表---------", res);
            let arr = Object.assign([], res.data);
            arr.unshift({
              id: 0,
              schoolName: "全部"
            });
            this.options = arr;
            reslove(res);
          }
        });
      });
    },
    getToStudent() {
      if (this.time == "") {
        this.$message({
          message: "请选择日期和学校"
        });
        return;
      } else {
        let params = { ...this.dataQuery };
        params.startTime = this.time + "-01";
        params.schoolStyle = this.schoolStyle;
        params.schoolId = this.schoolId;
        api.global.getSelectStuKqApi(params).then(res => {
          if (res.status) {
            console.log("-----------学生考勤---------", res.data);
            let arr = [
              { name: "出勤率", value: res.data.attendanceDay || 0 },
              { name: "缺勤率", value: res.data.disease || 0 }
            ];
            console.log(arr);
            this.chartData = arr;
            this.tableData = res.data.info;
            this.total = res.data.total;
            this.dataQuery.pageNum = res.data.pageNum;
            this.dataQuery.pageSize = res.data.pageSize;
          }
        });
      }
    },
    getPickData() {
      this.step++;
      console.log(this.time, this.step);
      if (this.step >= 2) {
        return this.getToStudent();
      }
    },
    getSelectData() {
      this.step++;
      console.log(this.schoolId, this.step);
      if (this.step >= 2) {
        return this.getToStudent();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.layout-row {
  .el-col {
    height: 632px;
    padding: 20px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(255, 255, 255, 1);
  }
}
.map {
  height: 600px;
  width: 100%;
}
.topMoudule {
  margin: 40px 0 20px 80px;
  transform: translateX(-30px);
  .ml {
    margin-left: 30px;
  }
}
.mb {
  margin-bottom: 10px;
  margin-left: 16px;
}
.nullData {
  height: 500px;
  line-height: 500px;
  width: 100%;
  text-align: center;
  font-size: 16px;
}
</style>
