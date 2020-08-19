<template>
  <div
    id="updataParkLocal"
    class="group-wrap-main"
    v-if="pagePath == '/parkLocalMam/updata'"
    :style="{height:pageHeight+'px',overflow:'auto'}"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="园区名称：" prop="schoolName">
        <el-input size="mini" v-model="ruleForm.schoolName" placeholder="请输入园区名称"></el-input>
      </el-form-item>
      <el-form-item label="园区地址：" prop="address">
        <chart v-model="ruleForm.address" :mapData="ruleForm" @getPoint="getPoint" />
      </el-form-item>
      <el-form-item label="园区类型：" prop="schoolStyle">
        <el-select size="mini" class="w180x dib ml mr" v-model="ruleForm.schoolStyle" placeholder="请选择">
          <el-option v-for="item in schoolType" :key="item.id"  align="center" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div class="tree-content">
        <el-form-item label="后台权限：" prop="pcList" class="tree-box">
          <el-tree
            :style="{ height: treeHeight + 'px', overflow: 'auto' }"
            :data="backList"
            show-checkbox
            node-key="id"
            :check-strictly="checkStrictly"
            ref="pcTree"
            :default-expand-all="true"
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>
        <el-form-item v-if="ruleForm.schoolStyle==1" label="App权限：" prop="appList" class="tree-box">
          <el-tree
            :style="{ height: treeHeight + 'px' }"
            :data="appList"
            :default-expand-all="true"
            :check-strictly="checkStrictly"
            show-checkbox
            ref="appTree"
            node-key="id"
            :props="defaultProps"
          >
          </el-tree>
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
import { mapState } from 'vuex';
import chart from '@/components/Map/chinaMap1'
export default {
  data() {
    return {
      center: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 15,
      rules: {
        kindergartenName: {
          required: true,
          message: "请输入园区名称！",
          trigger: "blur"
        },
        schoolName: {
          required: true,
          message: "请输入园区名称！",
          trigger: "blur"
        },
        address: {
          required: true,
          message: "请输入园区地址！",
          trigger: "change"
        },
        // appList: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少分配App一个权限！",
        //     trigger: "blur"
        //   }
        // ],
        pcList: [
          {
            type: "array",
            required: true,
            message: "请至少分配后台一个权限！",
            trigger: "blur"
          }
        ]
      },
      appList: [],
      backList: [],
      schoolType:[
        {
          label:'育幼通',
          id:1
        },
        {
          label:'快教务',
          id:2
        }
      ],
      ruleForm: {
        userId: Number(sessionStorage.getItem("userId")),
        schoolName: "",
        schoolStyle:1,
        appList: [],
        pcList: [],
        address: "",
        kindergartenName:"",
        latitude:'',
        longitude:'',
        compId:Number(sessionStorage.getItem("companyId"))
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      checkStrictly: false,
      showMapComponent: this.value,
      keyword: '',
    };
  },
  components:{
    chart
  },
  props: {
    value: Boolean,
    mapHeight: {
      type: Number,
      default: 500
    }
  },
  methods: {
    initPage() {
      let _this = this;
      let load = _this.$loading({
        target: document.querySelector(".tree-content"),
        text: "数据加载中请稍后..."
      });
      let userId = Number(sessionStorage.getItem("userId"));
      let compId = Number(sessionStorage.getItem("companyId"));
        _this.getYYTTree().then(() => {
          if (_this.$route.query.kindergartenId) {
            _this.checkStrictly = true;
            let id = _this.$route.query.kindergartenId;
            api.global
              .getOneParkInfoApi({id})  //获取单个园区信息
              .then(res => {
                console.log('--------获取单个园区信息-------',res)
                if (res.status == 200) {
                  _this.ruleForm = {
                    userId: Number(sessionStorage.getItem("userId")),
                    compId:Number(sessionStorage.getItem("companyId")),
                    schoolStyle:this.ruleForm.schoolStyle,
                    schoolName:res.data.school.schoolName,
                    pcList: res.data.pc,
                    address:res.data.school.address,
                    longitude:res.data.school.longitude,
                    latitude:res.data.school.latitude,
                    id
                  };
                  if(_this.ruleForm.schoolStyle==1){
                    _this.ruleForm.appList=res.data.app;
                  };
                  _this.center = {
                    lat:res.data.school.latitude,
                    lng:res.data.school.longitude
                  };
                  if(_this.ruleForm.schoolStyle==1){
                    _this.$refs.appTree.setCheckedKeys(
                      res.data.app
                    );
                  }
                  _this.$refs.pcTree.setCheckedKeys(
                    res.data.pc
                  );
                  load.close();
                  console.log(res.data , '-------回显数据--------')
                }
              })
              .then(() => {
                _this.checkStrictly = false;
              });
          } else {
            load.close();
          }
        });
    },
    findHasParentIds(arr) {
      let ids = [];
      for (const it of arr) {
        if (it.children) {
          this.findHasParentIds(it.children);
        }
      }
    },
    getPCTree() {
      let backList = this.$refs.pcTree.getCheckedNodes(false, true).map(item => item.id);
      return backList
    },
    getAppTree() {
      let appList = this.$refs.appTree.getCheckedNodes(false, true).map(item => item.id);
      
      return appList
    },
    insertParkLocal() {
      let _this = this;
      _this.ruleForm.pcList = _this.getPCTree();
      if(_this.ruleForm.schoolStyle==1){
        _this.ruleForm.appList = _this.getAppTree();
      }
      let load = _this.$loading({
        target: document.querySelector("#updataParkLocal"),
        text: "正在分配权限，请稍后..."
      });
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let options = Object.assign({}, _this.ruleForm);
          options.longitude=_this.center.lng;
          options.latitude=_this.center.lat;
          delete options.kindergartenName;
          console.log(options," 新增");
          if (_this.$route.query.kindergartenId) {
            options.schoolId=Number(_this.$route.query.kindergartenId);
            delete options.kindergartenId;
            if(_this.ruleForm.schoolStyle==2){
              delete options.appList;
              options.pcList.shift();
            }
            console.log(options,"编辑");
            api.global
              .updataParkApi(options)
              .then(res => {
                if (res.status == 200) {
                  load.close();
                  _this.$message({
                    message: "园区编辑成功！",
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
            if(_this.ruleForm.schoolStyle==2){
              delete options.appList;
              options.pcList.shift();
            }
            api.global
              .insertPark(options)
              .then(res => {
                if (res.status == 200) {
                  load.close();
                  _this.$message({
                    message: "园区创建成功！",
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
          }
        } else {
          load.close()
        }
      });
    },
    getYYTTree(){
      let _this = this;
      return new Promise((reslove,reject)=>{
        let params = { compId: Number(sessionStorage.getItem("companyId"))};
        api.global
        .getJurisdictionBack(params)
        .then(res => {
          console.log('--------获取后台权限----------',res.data);
          if (res.status == 200) {
            _this.backList = res.data;
            _this.findHasParentIds(res.data);
          }
        }).then(()=>{
          api.global
          .getJurisdictionApp({ compId: Number(sessionStorage.getItem("companyId"))})
          .then(res => {
            console.log('------获取APP权限-----',res.data);
            if (res.status == 200) {
              _this.appList = res.data;
              _this.findHasParentIds(res.data);
            }
            reslove(res)
          })
        })
      })
    },
    getKJWTree(){
      let _this = this;
      return new Promise((reslove,reject)=>{
        api.global
        .getKJWBack({
          compId: Number(sessionStorage.getItem("companyId"))
        })
        .then(res => {
          console.log("--------获取后台权限----------", res.data);
          if (res.status == 200) {
            let options = [
              {
                name: "所有权限",
                id: 9999999999,
                children: res.data
              }
            ];
            _this.backList = options;
            _this.findHasParentIds(res.data);
            reslove(res)
          }
        })
      })
    },
    closeAdd(){
      this.$router.go(-1)
    },
    getPoint(val){
      this.ruleForm.address = val.addr;
      this.center = val.center;
      console.log(this.center,this.ruleForm.address);
    }
  },
  watch:{
    'ruleForm.schoolStyle':{
      handler(val){
        console.log(val);
        if(val == 1){
          this.getYYTTree();
        }else{
          this.getKJWTree();
          this.appList = [];
        }
      },
      deep:true
    }
  },
  computed: {
    pagePath() {
      return this.$route.path;
    },
    pageHeight(){
      if(window.innerHeight > 1336){
        return window.innerHeight - 120
      }else{
        return window.innerHeight - 80
      }
    },
    treeHeight() {
      if(window.innerHeight > 1336){
        return window.innerHeight - 380
      }else{
        return window.innerHeight - 360
      }
    }
  },
  mounted() {
    this.ruleForm.schoolStyle = this.$route.query.schoolStyle;
    this.initPage();
  }
};
</script>

<style scoped lang="scss">
.group-wrap-main{
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
.btn-box {
  width: 100%;
  float: left;
}
.serachinput{
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
