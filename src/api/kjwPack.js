import axios from "@/utils/http";

const kjwPack = {
  // 教师考勤明细（需中小学出接口）
  getDetailsToTeacher(data) {
    return axios({
      method: "POST",
      contentType:"application/x-www-form-urlencoded",
      url: "/pc/kjwcommon/eduAffairsStudent/clockingdetailsToTeacher",
      data
    });
  }, 
  // 学生考勤明细（需中小学出接口）
  getDetailsToStudent(data) {
    return axios({
      method: "POST",
      contentType:"application/x-www-form-urlencoded",
      url: "/pc/kjwcommon/eduAffairsStudent/clockingdetailsToStudent",
      data
    });
  }, 
  // 招生情况统计（需中小学出接口）
  getStudentsView(params) {
    return axios({
      method: "get",
      contentType:"application/x-www-form-urlencoded",
      url: "/pc/kjwcommon/enrollmentStatistics/bxZsStatistics",
      params
    });
  }
};

export default kjwPack;
