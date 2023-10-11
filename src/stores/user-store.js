import { defineStore } from "pinia";
import Endpoint from "../services/Endpoint.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    token: "",
  }),
  getters: {
    doubleCount: (state) => "bearer " + state.token,
    isLogin: (state) => !!state.token && !!state.user.email,
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(localtoken) {
      localStorage.setItem("token", localtoken);
      this.token = localtoken;
    },
    async getUser(localtoken) {
      console.log({ local: localtoken });
      return Endpoint.getUserByToken(localtoken);
    },
    logOut() {
      this.user = {};
      this.token = "";
      localStorage.removeItem("token");
    },
  },
});
