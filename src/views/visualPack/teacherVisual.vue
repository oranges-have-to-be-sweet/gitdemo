<template>
  <div id="statics" :style="{ height: pageHeight + 'px', overflow: 'auto' }">
    <div class="topMoudule">
      <el-form
        :model="dataQuery"
        inline
        label-position="right"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="日期：">
          <el-date-picker
            value-format="yyyy-MM"
            class="w180x dib"
            v-model="dataQuery.startTime"
            type="month"
            :clearable="false"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学校类型：" label-width="100px">
          <el-select
            class="w180x dib mr"
            v-model="dataQuery.schoolStyle"
            placeholder="请选择"
          >
            <el-option
              v-for="item in schoolType1"
              :key="item.id"
              align="center"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校：">
          <el-select
            class="w180x dib mr"
            v-model="dataQuery.schoolId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in schoolList"
              :key="item.id"
              align="center"
              :label="item.schoolName"
              :value="item.id"
            ></el-option> </el-select
        ></el-form-item>
        <el-form-item>
          <el-button class="dib ml" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="layout-row">
      <el-col :span="10" :offset="1">
        <div class="mt map">
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
          <el-table-column prop="loginName" align="center" label="老师名称">
          </el-table-column>
          <el-table-column prop="should" align="center" label="应出勤（天）">
          </el-table-column>
          <el-table-column prop="thing" align="center" label="事假（天）">
          </el-table-column>
          <el-table-column prop="disease" align="center" label="病假（天）">
          </el-table-column>
          <el-table-column prop="other" align="center" label="其他假（天）">
          </el-table-column>
          <el-table-column align="center" label="缺勤（天）">
            <template slot-scope="scope">
              {{ scope.row.should - scope.row.actual }}
            </template>
          </el-table-column>
          <el-table-column prop="actual" align="center" label="实际出勤（天）">
          </el-table-column>
        </el-table>
        <Pagination
          v-if="total > 0"
          :total="total"
          @pagination="getData"
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
import { mapState } from "vuex";
import Pagination from "@/components/pagination";
import { TimeSelect } from "element-ui";
import global from "@/store/modules/global";
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
      schoolStyle: 1,
      schoolType1: [
        {
          label: "育幼通",
          id: 1
        }
      ],
      schoolId: "",
      chartData: [],
      tableData: [],
      dataQuery: {
        compId: Number(sessionStorage.getItem("companyId")),
        startTime: "",
        schoolId: 0,
        schoolStyle: 1,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapState({
      schoolList: state => state["global"].schoolList
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
        this.schoolId = 0;
      },
      immediate: true
    }
  },
  methods: {
    getData() {
      let _this = this;
      let load = this.$loading({
        target: document.querySelector("#statics"),
        text: "加载中..."
      });
      this.$store.dispatch(
        "global/a_setSchoolList",
        this.dataQuery.schoolStyle
      );
      let date = new Date();
      let num =
        Number(date.getMonth() + 1) > 10
          ? Number(date.getMonth() + 1)
          : "0" + Number(date.getMonth() + 1);
      this.dataQuery.startTime = date.getFullYear() + "-" + num + "-01";
      let params = { ...this.dataQuery };
      // console.log(params);
      api.global.getSelectTeaKqApi(params).then(res => {
        if (res.status == 200) {
          let arr = [
            { value: res.data.disease || 0, name: "请假率" },
            { value: res.data.attendanceDay || 0, name: "出勤率" }
          ];
          this.chartData = arr;
          this.tableData = res.data.info;
          this.total = res.data.total;
          this.dataQuery.pageNum = res.data.pageNum;
          this.dataQuery.pageSize = res.data.pageSize;
          load.close();
        } else {
          load.close();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.layout-row {
  .el-col {
    height: 632px;
    padding: 15px 20px;
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
}
.nullData {
  height: 500px;
  line-height: 500px;
  width: 100%;
  text-align: center;
  font-size: 16px;
}
</style>
