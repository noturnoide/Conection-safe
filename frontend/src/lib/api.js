import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const createReport = async (data) => {
  const res = await api.post("/reports", data);
  return res.data;
};

export const listReports = async () => {
  const res = await api.get("/reports");
  return res.data;
};

export const getReport = async (protocolo) => {
  const res = await api.get(`/reports/${protocolo}`);
  return res.data;
};
