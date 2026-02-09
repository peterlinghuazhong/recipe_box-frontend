import axios from "axios";
import { API_URL } from "./constants";

export const fetchComments = async (recipe_id) => {
  const res = await axios.get(`${API_URL}api/comments`, {
    params: recipe_id ? { recipe_id } : {},
  });
  return res.data;
};

export const createComment = async (data, token) => {
  const res = await axios.post(`${API_URL}api/comments`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateComment = async (id, data, token) => {
  const res = await axios.put(`${API_URL}api/comments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteComment = async (id, token) => {
  const res = await axios.delete(`${API_URL}api/comments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
