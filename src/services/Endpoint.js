import axios from "axios";

const url = process.env.VUE_API_ENDPOINT;
console.log(url);
const mainServer = axios.create({
  baseURL: url,
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
  planes({ path, body }) {
    return mainServer.post(url + `/v1/planes/${path}`, body);
  },
  monedas({ path, body }) {
    return mainServer.post(url + `/v1/monedas/${path}`, body);
  },
  bancos({ path, body }) {
    return mainServer.post(url + `/v1/bancos/${path}`, body);
  },
  impuestos({ path, body }) {
    return mainServer.post(url + `/v1/impuestos/${path}`, body);
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
  deleteEmpresa(empresaData) {
    return mainServer.post(url + "/v1/sub-dominios/delete", {
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
  getStateByCode() {
    return axios.get("https://countriesnow.space/api/v0.1/countries/states");
  },
};

export default Endpoint;
