import axios from "axios";
import { API_URL } from "./constants";

// GET all ingredients, optionally by recipe_id
export async function getIngredients(recipe_id = null) {
  try {
    const res = await axios.get(`${API_URL}api/ingredients`, {
      params: recipe_id ? { recipe_id } : {},
    });
    return res.data;
  } catch (error) {
    console.log("Failed to fetch ingredients:", error);
    return [];
  }
}

// GET single ingredient by id
export async function getIngredient(id) {
  try {
    const res = await axios.get(`${API_URL}api/ingredients/${id}`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch ingredient:", error);
    return null;
  }
}

// CREATE new ingredient (requires token)
export async function addIngredient(data, token = "") {
  try {
    const res = await axios.post(`${API_URL}api/ingredients`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to add ingredient:", error);
    return null;
  }
}

// UPDATE ingredient (requires token)
export async function updateIngredient(id, data, token = "") {
  try {
    const res = await axios.put(`${API_URL}api/ingredients/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.log("Failed to update ingredient:", error);
    return null;
  }
}

// DELETE ingredient (requires token)
export async function deleteIngredient(id, token = "") {
  try {
    const res = await axios.delete(`${API_URL}api/ingredients/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.log("Failed to delete ingredient:", error);
    return null;
  }
}
