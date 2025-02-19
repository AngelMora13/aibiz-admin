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
    return axios.post(url + "/auth/login", {
      email,
      password,
    });
  },
  getUser({ path, body }) {
    return mainServer.post(url + `/v1/users/${path}`, body);
  },
  planes({ path, body }) {
    return mainServer.post(url + `/planes/${path}`, body);
  },
  metodosPago({ path, body }) {
    return mainServer.post(url + `/metodos-pago/${path}`, body);
  },
  monedas({ path, body }) {
    return mainServer.post(url + `/monedas/${path}`, body);
  },
  bancos({ path, body }) {
    return mainServer.post(url + `/bancos/${path}`, body);
  },
  impuestos({ path, body }) {
    return mainServer.post(url + `/impuestos/${path}`, body);
  },
  getUserByToken({ token }) {
    return mainServer.post(url + "/auth/login", {});
  },
  getListSubDominios() {
    return mainServer.get(url + "/sub-dominios");
  },
  getListModules() {
    return axios.get(url + "/modulos");
  },
  getUsuarios() {
    return mainServer.get("/users");
  },
  createUsuarios(usuario) {
    return mainServer.post("/users/create/admi", usuario);
  },
  updateUsuarios(usuario) {
    return mainServer.post("/users/update/" + usuario._id, usuario);
  },
  deleteUsuarios(usuario) {
    return mainServer.delete("/users/delete/" + usuario._id);
  },
  deleteManyUsuarios(usuarios) {
    return mainServer.post("/users/deleteMany", usuarios);
  },
  createSubDominio(empresaData) {
    return mainServer.post(url + "/sub-dominios/create", empresaData);
  },
  updateEmpresa(empresaData) {
    return mainServer.post(url + "/sub-dominios/update/" + empresaData._id, {
      empresaData,
    });
  },
  disableManyEmpresas(empresaData) {
    return mainServer.post(url + "/sub-dominios/disabledMany", {
      empresaData,
    });
  },
  deleteEmpresa(empresaData) {
    return mainServer.post(url + "/sub-dominios/delete", {
      empresaData,
    });
  },
  disabledEmpresa(empresaData) {
    return mainServer.post(url + "/sub-dominios/disabled/" + empresaData._id, {
      empresaData,
    });
  },
  deleteManyEmpresas(empresaData) {
    return mainServer.post(url + "/sub-dominios/deleteMany", {
      empresaData,
    });
  },
  getStateByCode() {
    return axios.get("https://countriesnow.space/api/v0.1/countries/states");
  },
};

export default Endpoint;
