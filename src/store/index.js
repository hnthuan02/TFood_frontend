import { createStore } from "vuex";

const store = createStore({
  state: {
    isLogin: false,
    userInfo: null,
  },

  motations: {
    setLogin(state, userInfo) {
      state.isLogin = true;
      state.userInfo = userInfo;
    },
  },

  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },

  async login({ commit, dispatch }, credentials) {
    try {
      const response = await axios.post("/user/loginUser", {
        USERNAME: credentials.username,
        PASSWORD: credentials.password,
      });
      if (response.status >= 200 && response.status <= 300) {
        const user = response.data.message;
        const token = response.data.metadata;
        localStorage.setItem("token", token);
        commit("SET_LOGIN_STATE", user);

        await dispatch("getUserInfo");

        if (user.ROLE.IS_ADMIN) {
          return "admin";
        } else if (user.ROLE.BRANCH_MANAGER) {
          return "manager";
        } else if (user.ROLE.STAFF) {
          return "staff)";
        } else if (user.ROLE.SHIPPER) {
          return "shipper";
        } else if (user.ROLE.SHIPPER) {
          return "shipper";
        } else {
          return "unauthorized";
        }
      }
    } catch (error) {
      alert(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập." +
          error.toString()
      );
      return "error";
    }
  },
});

store.dispatch("checkToken");

export default store;
