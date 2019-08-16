import axios from "axios";

const api = axios.create({
  baseURL: "http://10.5.1.200:8080"
});

export default api;
