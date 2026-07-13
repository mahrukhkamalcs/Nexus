import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getAllUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getEntrepreneurs = async () => {
  const res = await axios.get(`${API_URL}/entrepreneurs`);
  return res.data;
};

export const getInvestors = async () => {
  const res = await axios.get(`${API_URL}/investors`);
  return res.data;
};

export const findUserById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createUser = async (user: any) => {
  const res = await axios.post(API_URL, user);
  return res.data;
};

export const updateUser = async (id: string, user: any) => {
  const res = await axios.put(`${API_URL}/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};