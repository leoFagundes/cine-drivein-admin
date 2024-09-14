import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3001",
  // baseURL: "https://cine-drivein-backend.onrender.com",
  baseURL: process.env.BACK_END_CONNECTION,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});
