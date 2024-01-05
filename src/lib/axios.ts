import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:3005/api/v1",
  headers: {
    "mac-address": "mac_address",
    cinemahall: "cin_j38DjAPc3KbFCVquNVnHs6",
  },
});

export default myAxios;
