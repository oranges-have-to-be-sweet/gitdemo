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
  getKJWBack(params) {
    // 获取后台权限列表
    return axios({
      method: "get",
      url: "/pc/kjw/school/backgroundPermission",
      params,
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
