import axios from "axios";
import config from "../config";

const API_BASE_URL = config.API_BASE_URL;

const API_URL = `${API_BASE_URL}/api/auth`;


export const registerUser = async (name, email, password) => {
  return await axios.post(`${API_URL}/register`, { name, email, password });
};

export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};
