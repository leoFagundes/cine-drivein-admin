import axios from "axios";

export const api = axios.create({
  baseURL: "https://cine-drivein-backend.onrender.com",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});
