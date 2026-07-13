import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/deals",
});

// =======================
// Get all deals
// =======================
export const getDeals = async () => {
  try {
    const res = await API.get("/");
    return res.data;
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
};

// =======================
// Get single deal
// =======================
export const getDealById = async (id: string) => {
  try {
    const res = await API.get(`/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching deal:", error);
    throw error;
  }
};

// =======================
// Create deal
// =======================
export const createDeal = async (dealData: any) => {
  try {
    const res = await API.post("/", dealData);
    return res.data;
  } catch (error) {
    console.error("Error creating deal:", error);
    throw error;
  }
};

// =======================
// Update deal
// =======================
export const updateDeal = async (id: string, dealData: any) => {
  try {
    const res = await API.put(`/${id}`, dealData);
    return res.data;
  } catch (error) {
    console.error("Error updating deal:", error);
    throw error;
  }
};

// =======================
// Delete deal
// =======================
export const deleteDeal = async (id: string) => {
  try {
    const res = await API.delete(`/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting deal:", error);
    throw error;
  }
};