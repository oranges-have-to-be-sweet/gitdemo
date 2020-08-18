import axios from "@/utils/http";
import qs from "qs"
const parkManage = {
  getJurisdictionBack(params) {
    // 获取后台权限列表
    return axios({
      method: "get",
      url: "/park/school/backgroundPermission",
      params,
    });
  },
  getJurisdictionApp(params) {
    // 获取APP权限列表
    return axios({
      method: "get",
      url: "/park/school/appPermission",
      params,
    });
  },
  getPrincipalListApi(data) {
    // 查询园长
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/getGardenLeaderData",
      data: data,
    });
  },
  //新增园长
  insertPrincipalApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/addGardenLeader",
      data: data,
    });
  },
  //关联的园区列表
  getNullKindergartenApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/selectSchoolList",
      data: data,
    });
  },
  relationParkApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/updategardenfrom",
      data: data,
    });
  },
  getParkDetailsApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/selectSchoolList",
      data: data,
    });
  },
  //查询单个园长信息
  getOnePrinView(data){
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/selectUser",
      data: data,
    });
  },
  updataPrincipal(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/updateUser",
      data: data,
    });
  },
};

export default parkManage;
