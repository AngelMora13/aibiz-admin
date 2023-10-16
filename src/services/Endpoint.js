import axios from "axios";

const url = "http://localhost:5000";
const mainServer = axios.create({
  baseURL: "http://localhost:5000",
});
mainServer.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
const Endpoint = {
  login({ email, password }) {
    return axios.post(url + "/v1/auth/login", {
      email,
      password,
    });
  },
  getUserByToken({ token }) {
    return mainServer.post(url + "/v1/auth/login", {});
  },
  getListSubDominios({ token }) {
    return axios.get(url + "/v1/sub-dominios", {
      headers: {
        Authorization: "bearer " + token,
      },
    });
  },
  getListModules() {
    return axios.get(url + "/v1/modulos");
  },
  getUsuarios() {
    return mainServer.get("/v1/users");
  },
  createUsuarios(usuario) {
    return mainServer.post("/v1/users/create/admi", usuario);
  },
  updateUsuarios(usuario) {
    return mainServer.post("/v1/users/update/" + usuario._id, usuario);
  },
  createSubDominio({ token, empresaData }) {
    return axios.post(
      url + "/v1/sub-dominios/create",
      { empresaData },
      {
        headers: {
          Authorization: "bearer " + token,
        },
      }
    );
  },
  disableManyEmpresas({ token, empresaData }) {
    return axios.post(
      url + "/v1/sub-dominios/disabledMany",
      { empresaData },
      {
        headers: {
          Authorization: "bearer " + token,
        },
      }
    );
  },
  deleteManyEmpresas({ token, empresaData }) {
    return axios.post(
      url + "/v1/sub-dominios/deleteMany",
      { empresaData },
      {
        headers: {
          Authorization: "bearer " + token,
        },
      }
    );
  },
};

export default Endpoint;
