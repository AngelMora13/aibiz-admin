import axios from "axios";

const url = "https://aibiz-beta-dev-jath.1.us-1.fl0.io"; // "http://localhost:5000";;
const mainServer = axios.create({
  baseURL: url, //"https://aibiz-beta-dev-jath.1.us-1.fl0.io",
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
  getListSubDominios() {
    return mainServer.get(url + "/v1/sub-dominios");
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
  deleteUsuarios(usuario) {
    return mainServer.delete("/v1/users/delete/" + usuario._id);
  },
  deleteManyUsuarios(usuarios) {
    return mainServer.post("/v1/users/deleteMany", usuarios);
  },
  createSubDominio(empresaData) {
    return mainServer.post(url + "/v1/sub-dominios/create", empresaData);
  },
  updateEmpresa(empresaData) {
    return mainServer.post(url + "/v1/sub-dominios/update/" + empresaData._id, {
      empresaData,
    });
  },
  disableManyEmpresas(empresaData) {
    return mainServer.post(url + "/v1/sub-dominios/disabledMany", {
      empresaData,
    });
  },
  disabledEmpresa(empresaData) {
    return mainServer.post(
      url + "/v1/sub-dominios/disabled/" + empresaData._id,
      { empresaData }
    );
  },
  deleteManyEmpresas(empresaData) {
    return mainServer.post(url + "/v1/sub-dominios/deleteMany", {
      empresaData,
    });
  },
};

export default Endpoint;
