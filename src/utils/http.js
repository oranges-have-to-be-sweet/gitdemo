import axios from "axios";
import { Message } from "element-ui"
const paramsFormatData = function(obj){
  const params = new URLSearchParams() 
  for (const variable in obj) {
    if( obj[''+variable] !== '' && obj[''+variable] !== undefined && obj[''+variable] !== null ){
      params.append(''+variable, obj[''+variable])
    }
  }
  return params
}
const service = axios.create({
  timeout: 10000
})
service.interceptors.request.use(
  config => {
    config.headers = {
      "Content-Type": config.contentType || "application/json;charset=utf-8",
      token: sessionStorage.getItem("token")
    };
    config.params = paramsFormatData(config.params);
    if(config.contentType == 'application/x-www-form-urlencoded'){
      config.data = paramsFormatData(config.data);
    }else{
      config.data = config.data;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
service.interceptors.response.use(
  response => {
    console.log(response.data,'544444444');
    if(response.data.status == 200 || response.status == 200){
      return response.data;
    }else if(response.data.status == 20011 || response.status == 20011){
      window.location.href = "/login";
      return Message({
        message: response.data.msg || response.msg || "error",
        type: "error",
        duration: 2 * 1000
      });
    }else{
      Message({
        message: response.data.msg || response.msg || "error",
        type: "error",
        duration: 2 * 1000
      });
      return Promise.reject(response.response);
    }
    
    // switch (response.data.status) {
    //   case 200:
    //     return response.data;
    //     break;
    //   case 20011:
    //       window.location.href = "/login";
    //       Message({
    //         message: response.data.msg || "error",
    //         type: "error",
    //         duration: 2 * 1000
    //       });
    //     break;
    //   default:
    //     Message({
    //       message: response.data.msg || "error",
    //       type: "error",
    //       duration: 2 * 1000
    //     });
    //     return Promise.reject(response.response);
    // }
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
