import axios from "@/utils/http";
const login = {
  loginInApi(data) {
    return axios({
      contentType: "application/x-www-form-urlencoded",
      method: "POST",
      url: "/park/login/auth",
      data
    });
  },
  getUserInfo(params) {
    return axios({
      contentType: "application/x-www-form-urlencoded;charset=UTF-8",
      method: "GET",
      url: "/park/login/getInfo",
      params
    });
  },
  loginOutApi(data) {
    return axios({
      method: "post",
      url: "/park/login/logout",
      data
    });
  }
};
export default login;
