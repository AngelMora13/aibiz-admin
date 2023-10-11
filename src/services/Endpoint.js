//import axios from "../boot/axios"
import axios from "axios";
const url = "http://localhost:5000";
const Endpoint = {
  login({ email, password }) {
    return axios.post(url + "/v1/auth/login", {
      email,
      password,
    });
  },
  getUserByToken({ token }) {
    return axios.post(
      url + "/v1/auth/login",
      {},
      {
        headers: {
          Authorization: "bearer " + token,
        },
      }
    );
  },
};

export default Endpoint;
