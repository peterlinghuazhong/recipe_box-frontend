import axios from "axios";
import { API_URL } from "./constants";

export async function getRecipes() {
  const res = await axios.get(API_URL + "api/recipes");
  return res.data;
}

export async function getRecipe(id) {
  const res = await axios.get(API_URL + "api/recipes/" + id);
  return res.data;
}

export async function addRecipe(data, token) {
  const res = await axios.post(API_URL + "api/recipes", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateRecipe(id, data, token) {
  const res = await axios.put(API_URL + "api/recipes/" + id, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteRecipe(id, token) {
  const res = await axios.delete(API_URL + "api/recipes/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
