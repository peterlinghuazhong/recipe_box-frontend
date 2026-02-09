import axios from "axios";
import { API_URL } from "./constants";

export const getSteps = async (recipe_id = null) => {
  try {
    const res = await axios.get(`${API_URL}api/recipesteps`, {
      params: recipe_id ? { recipe_id } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch steps:", error);
    return [];
  }
};

export const getStep = async (id) => {
  try {
    const res = await axios.get(`${API_URL}api/recipesteps/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch step:", error);
    return null;
  }
};

export const addStep = async (data, token = "") => {
  try {
    const res = await axios.post(`${API_URL}api/recipesteps`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to add step:", error);
    return null;
  }
};

export const updateStep = async (id, data, token = "") => {
  try {
    const res = await axios.put(`${API_URL}api/recipesteps/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update step:", error);
    return null;
  }
};

export const deleteStep = async (id, token = "") => {
  try {
    const res = await axios.delete(`${API_URL}api/recipesteps/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to delete step:", error);
    return null;
  }
};
