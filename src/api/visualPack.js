import axios from "@/utils/http";

const visualPack = {
  // 教师考勤明细（需中小学出接口）
  getDetailsToTeacher(params) {
    return axios({
      method: "get",
      contentType:"application/x-www-form-urlencoded",
      url: "/park/teacherAttendance",
      params
    });
  }, 
  // 学生考勤明细（需中小学出接口）
  getDetailsToStudent(params) {
    return axios({
      method: "get",
      contentType:"application/x-www-form-urlencoded",
      url: "/park/studentAttendance",
      params
    });
  }, 
  // 招生情况统计（需中小学出接口）
  getStudentsView(params) {
    return axios({
      method: "get",
      contentType:"application/x-www-form-urlencoded",
      url: "/park/enrollmentStatistics/bxZsStatistics",
      params
    });
  }
};

export default visualPack;
