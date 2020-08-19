import axios from "@/utils/http";

const global = {
  //文件图片上传
  uploadFileApi(data) {
    return axios({
      contentType: "multipart/form-data",
      url: "/file/upload",
      method: "post",
      data: data
    });
  },
  getParkSelectApi(data) {
    // 获取所有园区
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/selectLieBiao",
      params: data
    });
  },
  //公共查询园区
  getAllParkListApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/selectSchool",
      params: data
    });
  },
  //公共查询单个园区
  getOneParkInfoApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/selectOneSchool",
      params: data
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
  // 关联园区
  relationParkApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/park/updategardenfrom",
      data: data,
    });
  },
  //公共查询教师考勤
  getSearhTeaApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/tkq/selectTeaAttend",
      params: data
    });
  },
  //公共查询学生考勤
  getSearhStuApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/tkq/selectStuAttend",
      params: data
    });
  },
  //公共查询招生情况
  getSearhGetStuApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/tkq/selectInvitation",
      params: data
    });
  },
  //公共查询经纬度
  getAllLngLatListApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/selectLat",
      params: data
    });
  },
  //公共查询教师考勤
  getSelectTeaKqApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/tkq/selectTeaAttend",
      params: data
    });
  },
  //公共查询学生考勤
  getSelectStuKqApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/tkq/selectStuAttend",
      params: data
    });
  },
  //公共查询招生情况
  getSelectGetStuApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/tkq/selectInvitation",
      params: data
    });
  },
  
  //公共新增园区
  insertPark(data){
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/insertSchool",
      data: data,
    });
  },
  //查询单个园区信息
  getOneParkInfo(data){
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/selectSchool",
      data: data,
    });
  },

  //编辑园区/修改园区信息
  updataParkApi(data) {
    return axios({
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/updateSchool",
      data: data,
    });
  },
  getJurisdictionBack(params) {
    // 获取育幼通后台权限列表
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
    // 获取快教务后台权限列表
    return axios({
      method: "get",
      url: "/pc/kjw/school/backgroundPermission",
      params,
    });
  },
};

export default global;
