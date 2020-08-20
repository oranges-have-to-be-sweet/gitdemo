<template>
  <div id="parkLocal">
    <div class="group-wrap-main" v-show="pagePath == '/parkLocalMam'">
      <div class="form-content">
        <el-form inline size="mini">
          <el-form-item>
            <el-select v-model="searchForm.schoolStyle" placeholder="请选择">
              <el-option
                v-for="item in schoolType"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="el-icon-plus"
              type="primary"
              size="mini"
              @click="updata(0)"
              >新增学校</el-button
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
            label="学校名称"
          >
          </el-table-column>
          <!-- <el-table-column prop="schoolNo" align="center" label="学校编码">
          </el-table-column> -->
          <el-table-column prop="schoolStyle" align="center" label="学校类型">
            <template slot-scope="scope">
              {{scope.row.schoolStyle==1?'育幼通':'快教务'}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间">
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            :show-overflow-tooltip="true"
            label="学校地址"
          >
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="updata(scope)">
                编辑
              </el-button>
              <el-button size="mini" type="text" @click="goLogin(scope)">
                <a :href="hrefUrl" target='_blank'>
                  跳转去登陆
                </a>
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
      hrefUrl:'',
      tableData: [],
      searchForm: {
        compId: Number(sessionStorage.getItem("companyId")),
        userId: Number(sessionStorage.getItem("userId")),
        schoolStyle:3,
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
      console.log(options)
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
      console.log(val.row) 
      if (val) {
        this.$router.push({
          path: "/parkLocalMam/updata",
          query: { kindergartenId: val.row.id ,schoolStyle:val.row.schoolStyle}
        });
      } else {
        this.$router.push("/parkLocalMam/updata");
      }
    },
    goLogin(val){
      // let token = sessionStorage.getItem('token');
      // let userId = sessionStorage.getItem('userId');
      let yyt_devHref = process.env.VUE_APP_HREF_YYT //+ `?banXueToken=${token}&userId=${userId}`;
      let kjw_Href = process.env.VUE_APP_HREF_KJW //+ `?banXueToken=${token}&userId=${userId}`;
      this.hrefUrl = val.row.schoolStyle==1?yyt_devHref:kjw_Href;
      
    },
    getInfoData() {
      let id = sessionStorage.getItem("userId");
    }
  },
  watch:{
    'searchForm.schoolStyle':{
      handler(val){
        this.refresh()
      },
      deep:true
    }
  },
  computed: {
    ...mapState({
      schoolType: state => state["global"].schoolType, 
    }),
    tableHeight() {
      if(window.innerHeight > 1336){
        return window.innerHeight - 200;
      }else{
        return window.innerHeight - 220;
      }
    },
    columnHeight() {
      return (this.tableHeight - 80) / 10 + "px";
    },
    pagePath() {
      return this.$route.path;
    }
  },
  async created() {
    await this.getInfoData();
  },
  mounted() {
    this.refresh();
  },
  components: {
    Pagination
  }
};
</script>

<style scoped lang="scss">
.group-wrap-main{
  width: 96%;
  padding: 20px 2%;
}
</style>
