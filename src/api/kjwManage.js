import axios from "@/utils/http";
// import qs from "qs"
const kjwManage = {
  getJurisdictionBack(params) {
    // 获取后台权限列表
    return axios({
      method: "get",
      url: "/pc/kjw/school/backgroundPermission",
      params,
    });
  },
  getPrincipalListApi(data) {
    // 查询园长列表
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/pc/kjwcommon/campusController/getGardenLeaderData",
      data: data,
    });
  },
  //新增园长
  insertPrincipalApi(data) {
    return axios({
      method: "POST",
      // contentType: "application/x-www-form-urlencoded",
      url: "/pc/kjwcommon/campusController/addGardenLeader",
      data: data,
    });
  },
  //关联的园区列表
  getNullKindergartenApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/pc/kjw/school/selectSchoolList",
      data: data,
    });
  },
  //关联园区
  relationParkApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/pc/kjw/school/updategardenfrom",
      data: data,
    });
  },
  getParkDetailsApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/pc/kjw/selectSchoolList",
      data: data,
    });
  }
};

export default kjwManage;
