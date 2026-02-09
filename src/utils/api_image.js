import axios from "axios";
import { API_URL } from "./constants";

export const uploadImage = async (image, token = "") => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await axios.post(API_URL + "api/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.data; // { image_url: "/api/uploads/filename.jpg" }
};
