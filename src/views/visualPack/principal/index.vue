<template>
  <div id="principal">
    <div
      class="form-content group-wrap-main"
      :style="{ height: pageHeight + 'px', overflow: 'auto' }"
    >
      <el-form>
        <el-form-item style="margin:0;">
          <el-button
            class="el-icon-plus"
            style="margin:20px 0;"
            type="primary"
            size="mini"
            @click="openDialog"
            >新增账号</el-button
          >
        </el-form-item>
      </el-form>
      <div class="table-content">
        <el-table
          border
          :data="tableData"
          :height="tableHeight"
          style="width:100%;"
          :row-style="{ height: columnHeight }"
          :cell-style="{ padding: '0px' }"
          tooltip-effect="light"
          v-loading="tableLoading"
        >
          <el-table-column prop="emplName" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" align="center" label="手机号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="绑定学校"
          >
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.idList" :key="item.value">
                {{
                  scope.row.idList.length
                    ? scope.row.idList.length - 1 == index
                      ? item.label
                      : item.label + ","
                    : "空"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="isDel" align="center" label="是否启用">
            <template slot-scope="scope">
              <!-- v-model="scope.row.isDel" -->
              <el-switch
                :active-value="scope.row.isDel == 1"
                :inactive-value="scope.row.isDel == 0"
                @change="updateDel(scope)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间">
          </el-table-column>
          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="openRelation(scope)"
                >关联学校</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paging-box">
        <Pagination
          v-show="total > 0"
          :total="total"
          @pagination="
            () => {
              this.refresh();
            }
          "
          :page.sync="searchForm.pageNum"
          :limit.sync="searchForm.pageSize"
        ></Pagination>
      </div>
    </div>
    <el-dialog
      title="新增园长"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
      custom-class="add-dialog"
    >
      <!-- v-if="dialogVisible" -->
      <div class="dialog-content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名：" prop="loginName">
            <el-input size="mini" v-model="ruleForm.loginName"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input
              size="mini"
              v-model="ruleForm.phone"
              maxlength="11"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input
              size="mini"
              v-model="ruleForm.password"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="insertPrincipal"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="关联学校"
      :visible.sync="relationDialog"
      :close-on-click-modal="false"
      width="38%"
      custom-class="relationDialog"
      :lock-scroll="true"
    >
      <div class="relationDom">
        <el-cascader
          :options="parkList"
          :props="{
            multiple: true
          }"
          v-model="relationForm.idList"
          :show-all-levels="false"
          placeholder="请选择学校(多选)"
        >
          <!-- <template slot-scope="{ node, data }">
            <div @click="getNode(node, data)">
              <span>{{ data.label }}</span>
            </div>
          </template> -->
        </el-cascader>
        <p style="margin-left:12px;color:#777;">
          当前账号绑定学校后，其他账号不能绑定该学校
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="relationDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="relationPark"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
import api from "@/api";
import md5 from "md5";
import { mapState } from "vuex";
export default {
  name: "Principal1",
  data() {
    let vm = this;
    let schoolLista = (rule, value, callback) => {
      let list = vm.relationForm.schoolList;
      console.log(list, "listlist");
      if (!Array.isArray(list) || list.length == 0) {
        return callback(new Error("请选择需要关联的园区！"));
      } else {
        if (list.length !== 0) {
          vm.$refs.relationForm.clearValidate("schoolList");
        }
        callback();
      }
    };
    return {
      total: 0,
      stuProps: {
        multiple: true
      },
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      schoolStyle: 1,
      schoolType: [
        {
          label: "育幼通",
          id: 1
        },
        {
          label: "快教务",
          id: 2
        }
      ],
      onlSchoolList: [],
      newSchoolList: [],
      parkList: [],
      searchForm: {
        userId: Number(sessionStorage.getItem("userId")),
        pageNum: 1,
        pageSize: 10,
        compId: Number(sessionStorage.getItem("companyId"))
      },
      ruleForm: {
        loginName: "",
        phone: "",
        password: "",
        compId: Number(sessionStorage.getItem("companyId")),
        userId: Number(sessionStorage.getItem("userId"))
      },
      up_ruleForm: {
        loginName: "",
        mobilePhone: "",
        leaderId: "",
        password: ""
      },
      relationDialog: false,
      rules: {
        loginName: {
          required: true,
          message: "请输入真实姓名！",
          trigger: "blur"
        },
        phone: { required: true, message: "请输入手机号！", trigger: "blur" },
        password: { required: true, message: "请输入密码！", trigger: "blur" }
      },
      relationForm: {
        userId: Number(sessionStorage.getItem("userId")),
        compId: "",
        idList: [],
        schoolList: [],
        middleSchoolList: [],
        leaderId: "",
        emplId: ""
      },
      relationFormRules: {
        schoolList: {
          validator: schoolLista,
          trigger: "change"
        }
      }
    };
  },
  methods: {
    refresh() {
      let _this = this;
      let options = Object.assign({}, _this.searchForm);
      console.log(options);
      _this.tableLoading = true;
      api.global
        .getPrincipalListApi(options)
        .then(res => {
          if (res.status == 200) {
            _this.tableLoading = false;
            _this.total = res.data.total;
            _this.tableData = res.data.list;
            let yyt = [];
            let kjw = [];
            let arr = res.data.list.map(item => {
              yyt = item.schools.map(yytItem => {
                return {
                  label: yytItem.name,
                  value: yytItem.id
                };
              });
              kjw = item.middle.map(kjwItem => {
                return {
                  label: kjwItem.name,
                  value: kjwItem.id
                };
              });
              item.idList = [...yyt, ...kjw];
              return item;
            });
            console.log(arr);
            _this.searchForm.pageNum = res.data.pageNum;
            _this.searchForm.pageSize = res.data.pageSize;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateDel(val) {
      let _this = this;
      api.global.updataDel({ userId: val.row.userId }).then(res => {
        if (res.status == 200) {
          if (val.row.isDel == 0) {
            _this.$message({
              type: "success",
              message: "禁用成功"
            });
            _this.refresh();
          } else {
            _this.$message({
              type: "success",
              message: "启用成功"
            });
            _this.refresh();
          }
        } else {
          _this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    openDialog() {
      this.ruleForm = {
        loginName: "",
        phone: "",
        compId: Number(sessionStorage.getItem("companyId")),
        userId: Number(sessionStorage.getItem("userId"))
      };
      this.dialogVisible = true;
    },
    insertPrincipal() {
      let _this = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let options = Object.assign({}, _this.ruleForm);
          let load = this.$loading({
            target: document.querySelector(".dialog-content"),
            text: "正在提交数据请稍后..."
          });
          options.password = md5(options.password);
          api.global.insertPrincipalApi(options).then(res => {
            if (res.status == 200) {
              load.close();
              this.$message({
                message: "新增园长成功",
                type: "success"
              });
              _this.dialogVisible = false;
              _this.refresh();
            } else if (res.status == 2004) {
              this.$message({
                type: "warning",
                message: "手机号已存在"
              });
            }
          });
          load.close();
          _this.dialogVisible = false;
          _this.refresh();
        }
      });
    },

    //获取关联列表
    openRelation(data) {
      let _this = this;
      let datas = data.row;
      _this.relationDialog = true;
      let load = this.$loading({
        target: document.querySelector(".relationDialog"),
        text: "加载中..."
      });
      _this.relationForm.leaderId = datas.userId;
      _this.relationForm.emplId = datas.emplId;
      _this.relationForm.compId = datas.compId;
      let compId = Number(sessionStorage.getItem("companyId"));
      api.global
        .getNullKindergartenApi({ compId: compId, leaderId: datas.userId })
        .then(res => {
          if (res.status == 200) {
            _this.$nextTick(() => {
              let yyt = datas.schools.map(item => {
                return {
                  label: item.name,
                  value: item.id,
                  pId: 1
                };
              });
              let kjw = datas.middle.map(item => {
                return {
                  label: item.name,
                  value: item.id,
                  pId: 2
                };
              });
              console.log(yyt, "育幼通", kjw, "快教务");
              _this.relationForm.idList = [...yyt, ...kjw].map(item => {
                return [item.pId, item.value];
              });
              let arr = res.data.map(item => {
                item.children = item.children.map(it => {
                  return {
                    label: it.name,
                    value: it.id
                  };
                });
                console.log(item, "22222");
                return item;
              });
              _this.parkList = arr;
              console.log(_this.parkList, "可关联的园区树");
              console.log(_this.relationForm.idList, "已关联的园区");
              load.close();
            });
          } else {
            load.close();
          }
        })
        .catch(err => {
          load.close();
        });
    },
    //提交关联
    relationPark() {
      let _this = this;
      console.log(_this.relationForm.idList);
      // return false;
      _this.relationForm.schoolList = _this.relationForm.idList
        .filter(item => item[0] == 1)
        .map(item => item[1]);
      _this.relationForm.middleSchoolList = _this.relationForm.idList
        .filter(item => item[0] == 2)
        .map(item => item[1]);
      console.log(_this.relationForm.schoolList, "1111111");
      console.log(_this.relationForm.middleSchoolList, "22222222");
      let options = Object.assign({}, _this.relationForm);
      delete options.id;
      console.log(options);
      let load = _this.$loading({
        target: document.querySelector(".relationDialog")
      });
      api.global
        .relationParkApi(options)
        .then(res => {
          if (res.status == 200) {
            _this.$message({
              message: "园区关联成功！",
              type: "success"
            });
            load.close();
            _this.refresh();
            _this.relationDialog = false;
          } else {
            _this.$message({
              message: res.msg,
              type: "warning"
            });
            load.close();
            _this.relationDialog = false;
          }
          _this.relationDialog = false;
        })
        .catch(err => {
          _this.$message.error({
            message: err
          });
          load.close();
        });
    },
    getNode(node, data) {
      console.log(node, data);
    },
    openUpdata(data) {
      console.log(data.gardenInfo);
      this.up_ruleForm = {
        loginName: data.gardenInfo.emplName,
        mobilePhone: data.gardenInfo.phone,
        leaderId: data.gardenInfo.userId
      };
    },
    getInfoData() {
      let id = sessionStorage.getItem("userId");
    }
  },
  computed: {
    tableHeight() {
      if (window.innerHeight > 1336) {
        return window.innerHeight - 290;
      } else {
        return window.innerHeight - 250;
      }
    },
    columnHeight() {
      return (this.tableHeight - 60) / 10 + "px";
    },
    pageHeight() {
      if (window.innerHeight > 1336) {
        return window.innerHeight - 120;
      } else {
        return window.innerHeight - 80;
      }
    }
  },
  mounted() {
    this.refresh();
    console.log(this.$route.path, "----路由---");
  },
  async created() {
    await this.getInfoData();
  },
  components: {
    Pagination
  }
};
</script>

<style scoped lang="scss">
.group-wrap-main {
  width: 96%;
  padding: 20px 2%;
}
.relationDom {
  .el-col {
    margin: 10px;
  }
}
</style>
