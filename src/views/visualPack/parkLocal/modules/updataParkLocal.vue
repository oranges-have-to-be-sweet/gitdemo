<template>
  <div
    v-if="pagePath == '/parkLocalMam/updata'"
    id="updataParkLocal"
    class="group-wrap-main"
    :style="{ height: pageHeight + 'px', overflow: 'auto' }"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="学校名称：" prop="schoolName">
        <el-input
          v-model="ruleForm.schoolName"
          size="mini"
          placeholder="请输入学校名称"
        />
      </el-form-item>
      <el-form-item label="学校地址：" prop="address">
        <chart
          v-model="ruleForm.address"
          :map-data="mapData"
          @getPoint="getPoint"
        />
      </el-form-item>
      <el-form-item label="学校类型：" prop="schoolStyle">
        <el-select
          v-model="ruleForm.schoolStyle"
          size="mini"
          class="w180x dib ml mr"
          :disabled="disabledType"
          @change="getTree"
        >
          <el-option
            v-for="item in schoolType"
            :key="item.id"
            align="center"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <div class="tree-content">
        <el-form-item label="后台权限：" prop="pcList" class="tree-box">
          <el-tree
            ref="pcTree"
            :style="{ height: treeHeight + 'px', overflow: 'auto' }"
            :data="backList"
            show-checkbox
            node-key="id"
            :check-strictly="checkStrictly"
            :default-expand-all="true"
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.schoolStyle == 1"
          label="App权限："
          prop="appList"
          class="tree-box"
        >
          <el-tree
            ref="appTree"
            :style="{ height: treeHeight + 'px', overflowY: 'auto' }"
            :data="appList"
            :default-expand-all="true"
            :check-strictly="checkStrictly"
            show-checkbox
            node-key="id"
            :props="defaultProps"
          />
        </el-form-item>
      </div>
      <div class="btn-box">
        <el-button size="mini" type="primary" @click="insertParkLocal"
          >确定</el-button
        >
        <el-button size="mini" @click="closeAdd">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import api from "@/api";
import { mapState } from "vuex";
import chart from "@/components/Map/chinaMap1";
export default {
  components: {
    chart
  },
  props: {
    value: Boolean,
    mapHeight: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      disabledType: false,
      center: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 15,
      rules: {
        kindergartenName: {
          required: true,
          message: "请输入学校名称！",
          trigger: "blur"
        },
        schoolName: {
          required: true,
          message: "请输入学校名称！",
          trigger: "blur"
        },
        address: {
          required: true,
          message: "请输入学校地址！",
          trigger: "change"
        }
        // appList: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少分配App一个权限！",
        //     trigger: "blur"
        //   }
        // ],
        // pcList: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少分配后台一个权限！",
        //     trigger: "blur"
        //   }
        // ]
      },
      appList: [],
      backList: [],
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
      ruleForm: {
        userId: Number(sessionStorage.getItem("userId")),
        schoolName: "",
        schoolStyle: 3,
        appList: [],
        pcList: [],
        address: "",
        kindergartenName: "",
        latitude: "",
        longitude: "",
        compId: Number(sessionStorage.getItem("companyId"))
      },
      mapData: {
        address: "",
        latitude: "",
        longitude: ""
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      checkStrictly: false,
      showMapComponent: this.value,
      keyword: ""
    };
  },
  computed: {
    pagePath() {
      return this.$route.path;
    },
    pageHeight() {
      if (window.innerHeight > 1336) {
        return window.innerHeight - 120;
      } else {
        return window.innerHeight - 80;
      }
    },
    treeHeight() {
      if (window.innerHeight > 1336) {
        return window.innerHeight - 380;
      } else {
        return window.innerHeight - 360;
      }
    }
  },
  watch: {
    mapData(val) {
      console.log(val);
      this.mapData = val;
    }
  },
  mounted() {
    this.disabledType = !!this.$route.query.kindergartenId;
    this.ruleForm.schoolStyle = this.$route.query.schoolStyle || 1;
    console.log(this.ruleForm.schoolStyle);
    this.initPage();
  },
  methods: {
    initPage() {
      const _this = this;
      const load = _this.$loading({
        target: document.querySelector(".tree-content"),
        text: "数据加载中请稍后..."
      });
      const userId = Number(sessionStorage.getItem("userId"));
      const compId = Number(sessionStorage.getItem("companyId"));
      if (this.ruleForm.schoolStyle == 1) {
        _this.getYYTTree();
      } else {
        _this.getKJWTree();
      }
      if (_this.$route.query.kindergartenId) {
        _this.checkStrictly = true;
        const id = _this.$route.query.kindergartenId;
        api.global
          .getOneParkInfoApi({ id }) // 获取单个学校信息
          .then(res => {
            // console.log('--------获取单个学校信息-------',res)
            if (res.status == 200) {
              _this.ruleForm = {
                userId: Number(sessionStorage.getItem("userId")),
                compId: Number(sessionStorage.getItem("companyId")),
                schoolStyle: Number(this.ruleForm.schoolStyle),
                schoolName: res.data.school.schoolName,
                pcList: res.data.pc,
                address: res.data.school.address,
                longitude: res.data.school.longitude,
                latitude: res.data.school.latitude,
                id
              };
              _this.mapData = {
                // 给chart赋值
                address: res.data.school.address,
                longitude: res.data.school.longitude,
                latitude: res.data.school.latitude
              };
              if (_this.ruleForm.schoolStyle == 1) {
                _this.ruleForm.appList = res.data.app;
              }
              _this.center = {
                lat: res.data.school.latitude,
                lng: res.data.school.longitude
              };
              if (_this.ruleForm.schoolStyle == 1) {
                _this.$refs.appTree.setCheckedKeys(res.data.app);
              }
              _this.$refs.pcTree.setCheckedKeys(res.data.pc);
              load.close();
              console.log(res.data, "-------回显数据--------");
            }
          })
          .then(() => {
            _this.checkStrictly = false;
          });
      } else {
        load.close();
      }
    },
    findHasParentIds(arr) {
      const ids = [];
      for (const it of arr) {
        if (it.children) {
          this.findHasParentIds(it.children);
        }
      }
    },
    getPCTree() {
      const backList = this.$refs.pcTree
        .getCheckedNodes(false, true)
        .map(item => item.id);
      return backList;
    },
    getAppTree() {
      const appList = this.$refs.appTree
        .getCheckedNodes(false, true)
        .map(item => item.id);
      return appList;
    },
    insertParkLocal() {
      const _this = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const load = _this.$loading({
            target: document.querySelector("#updataParkLocal"),
            text: "正在分配权限，请稍后..."
          });
          _this.ruleForm.pcList = _this.getPCTree();
          if (_this.ruleForm.pcList.length == 0) {
            return _this.$message({
              type: "warning",
              message: "请至少给后台分配一个权限"
            });
          }
          if (_this.ruleForm.schoolStyle == 1) {
            _this.ruleForm.appList = _this.getAppTree();
            if (_this.ruleForm.appList.length == 0) {
              return _this.$message({
                type: "warning",
                message: "请至少给app分配一个权限"
              });
            }
          }
          const options = Object.assign({}, _this.ruleForm);
          options.longitude = _this.center.lng;
          options.latitude = _this.center.lat;
          delete options.kindergartenName;
          console.log(options, " 新增");
          if (_this.$route.query.kindergartenId) {
            options.schoolId = Number(_this.$route.query.kindergartenId);
            delete options.kindergartenId;
            if (_this.ruleForm.schoolStyle == 2) {
              delete options.appList;
              options.pcList.shift();
            }
            console.log(options, "编辑");
            api.global
              .updataParkApi(options)
              .then(res => {
                if (res.status == 200) {
                  load.close();
                  _this.$message({
                    message: "学校编辑成功！",
                    type: "success"
                  });
                  _this.$router.back();
                  _this.publish("parkLocal");
                } else {
                  load.close();
                  _this.$message.error({
                    message: res.msg
                  });
                }
              })
              .catch(err => {
                load.close();
              });
          } else {
            delete options.kindergartenId;
            delete options.kindergartenName;
            if (_this.ruleForm.schoolStyle == 2) {
              delete options.appList;
              options.pcList.shift();
            }
            api.global
              .insertPark(options)
              .then(res => {
                if (res.status == 200) {
                  load.close();
                  _this.$message({
                    message: "学校创建成功！",
                    type: "success"
                  });
                  _this.$router.back();
                } else {
                  load.close();
                  _this.$message.error({
                    message: res.msg
                  });
                }
              })
              .catch(err => {
                load.close();
              });
          }
        }
      });
    },
    getYYTTree() {
      const _this = this;
      // return new Promise((reslove,reject)=>{
      const params = { compId: Number(sessionStorage.getItem("companyId")) };
      const backApi = api.global.getJurisdictionBack(params);
      const appApi = api.global.getJurisdictionApp(params);
      Promise.all([backApi, appApi])
        .then(values => {
          console.log(values);
          _this.backList = values[0].data;
          _this.appList = values[1].data;
        })
        .catch(err => {
          this.$message({ type: "error", message: "获取权限错误" });
        });
    },
    getKJWTree() {
      const _this = this;
      api.global
        .getKJWBack({
          compId: Number(sessionStorage.getItem("companyId"))
        })
        .then(res => {
          console.log("--------获取后台权限----------", res.data);
          if (res.status == 200) {
            const options = [
              {
                name: "所有权限",
                id: 9999999999,
                children: res.data
              }
            ];
            _this.backList = options;
            _this.findHasParentIds(res.data);
          }
        })
        .catch(err => {
          reject(
            _this.$message({ type: "error", message: "获取权限错误（kjw）" })
          );
        });
      // })
    },
    closeAdd() {
      this.$router.go(-1);
    },
    getPoint(val) {
      this.ruleForm.address = val.addr;
      this.center = val.center;
      console.log(this.center, this.ruleForm.address);
    },
    getTree() {
      if (this.ruleForm.schoolStyle == 1) {
        this.getYYTTree();
      } else {
        this.getKJWTree();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.group-wrap-main {
  width: 96%;
  padding: 20px 2%;
}
.tree-content {
  overflow: hidden;
}
.tree-box {
  width: 45%;
  float: left;
  v::deep .el-tree {
    overflow-y: auto !important;
  }
}
.tree-box:not(:last-child) {
  margin-left: 20px;
}
.btn-box {
  width: 100%;
  float: left;
}
.serachinput {
  width: 300px;
  box-sizing: border-box;
  padding: 9px;
  border: 1px solid #dddee1;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 4px;
  -webkit-box-shadow: #666 0px 0px 10px;
  -moz-box-shadow: #666 0px 0px 10px;
  box-shadow: #666 0px 0px 10px;
}
</style>
