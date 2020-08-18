<template>
  <div id="parkLocal">
    <div class="group-wrap-main" v-show="pagePath == '/parkLocalMam'">
      <div class="form-content">
        <el-form>
          <el-form-item>
            <el-button
              class="el-icon-plus"
              type="primary"
              size="mini"
              @click="updata(0)"
              >新增园区</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content">
        <el-table
          border
          :data="tableData"
          :height="tableHeight"
          style="width: 100%;"
          :row-style="{ height: columnHeight }"
          :cell-style="{ padding: '0px' }"
          tooltip-effect="light"
          v-loading="tableLoading"
        >
          <el-table-column
            prop="schoolName"
            align="center"
            label="园区名称"
          >
          </el-table-column>
          <el-table-column prop="schoolNo" align="center" label="园区编码">
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间">
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            :show-overflow-tooltip="true"
            label="园区地址"
          >
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="updata(scope)">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        v-show="total > 0"
        :total="total"
        @pagination="() => {
            this.refresh();
          }"
        :page.sync="searchForm.pageNum"
        :limit.sync="searchForm.pageSize"
      ></Pagination>
    </div>
    <router-view />
  </div>
</template>
<script>
import api from "@/api";
import Pagination from "@/components/pagination";
import { mapState } from "vuex";
export default {
  name: "ParkLocal",
  data() {
    return {
      total: 0,
      tableLoading: false,
      tableData: [],
      searchForm: {
        compId: Number(sessionStorage.getItem("companyId")),
        userId: Number(sessionStorage.getItem("userId")),
        schoolStyle:1,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    refresh() {
      let _this = this;
      let options = Object.assign({}, _this.searchForm);
      _this.tableLoading = true;
      api.global
        .getAllParkListApi(options)
        .then(res => {
          if (res.status == 200) {
            _this.tableLoading = false;
            _this.total = res.data.total;
            _this.searchForm.pageNum = res.data.pageNum;
            _this.searchForm.pageSize = res.data.pageSize;
            _this.tableData = res.data.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updata(val) {
      // console.log(val.row) 
      if (val) {
        this.$router.push({
          path: "/parkLocalMam/updata",
          query: { kindergartenId: val.row.id }
        });
      } else {
        this.$router.push("/parkLocalMam/updata");
      }
    },
    // publishCb(type) {
    //   // 发布
    //   if (type == "parkLocal") {
    //     this.refresh();
    //   }
    // },
    getInfoData() {
      let id = sessionStorage.getItem("userId");
      // if (!this.userInfo) {
      //   this.$store.dispatch("getUserInfo", { userId: id });
      // }
    }
  },
  computed: {
    tableHeight() {
      if(window.innerHeight > 1336){
        return window.innerHeight - 200;
      }else{
        return window.innerHeight - 180;
      }
    },
    columnHeight() {
      return (this.tableHeight - 80) / 10 + "px";
    },
    pagePath() {
      return this.$route.path;
    },
    // ...mapState({
    //   userInfo(state) {
    //     return state["module"].userInfo;
    //   }
    // })
  },
  async created() {
    await this.getInfoData();
  },
  mounted() {
    // 在此订阅
    // this.subscribe("parkLocal");
    this.refresh();
  },
  components: {
    Pagination
  }
};
</script>

<style scoped lang="scss"></style>
