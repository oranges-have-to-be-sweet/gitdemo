import api from "@/api";
const state = {
  schoolType: [
    {
      label: "育幼通",
      id: 1
    },
    {
      label: "快教务",
      id: 2
    },
    {
      label: "全部",
      id: 3
    }
  ],
  schoolList: []
};

const mutations = {
  m_setSchoolList: (state, data) => {
    state.schoolList = data;
  }
};

const actions = {
  a_setSchoolList({ commit }, data) {
    // console.log({ commit }, data);
    let params = {
      userid: Number(sessionStorage.getItem("userId")),
      compId: Number(sessionStorage.getItem("companyId")),
      schoolStyle: data //this.schoolStyle
    };
    api.global.getParkSelectApi(params).then(res => {
      if (res.status == 200) {
        // console.log(res.data, "vuex");
        let arr = Object.assign([], res.data);
        arr.unshift({
          id: 0,
          schoolName: "全部"
        });
        commit("m_setSchoolList", arr);
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
