import axios from "@/utils/http";

const global = {
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
  //公共查询经纬度
  getAllLngLatListApi(data) {
    return axios({
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      url: "/public/selectLat",
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
};

export default global;
