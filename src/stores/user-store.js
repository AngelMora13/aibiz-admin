import { defineStore } from "pinia";
import Endpoint from "../services/Endpoint.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    token: "",
    isLoginLoading: false,
  }),
  getters: {
    bearerToken: (state) => "bearer " + state.token,
    isLogin: (state) => !!state.token && !!state.user.email,
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      localStorage.setItem("token", token);
      this.token = token;
    },
    async makeLogin() {
      this.isLoginLoading = true;
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await this.getUser({ token });
          this.token = token;
          this.user = data;
        } catch (e) {
          console.log(e);
          localStorage.removeItem("token");
        }
      }
      this.isLoginLoading = false;
    },
    async getUser(token) {
      return Endpoint.getUserByToken(token);
    },
    loginSuccess({ persona, token }) {
      localStorage.setItem("token", token);
      this.token = token;
      this.user = persona;
    },
    logOut() {
      this.user = {};
      this.token = "";
      localStorage.removeItem("token");
    },
  },
});
