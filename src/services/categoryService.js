import axios from "axios";

const BASE_URL = "http://localhost:8080/category";
export const addCategory = async (formData) => {
  const response = await axios.post(`${BASE_URL}/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllCategories = () =>
  axios.get(`${BASE_URL}/showAll`);

export const deleteCategory = (id) =>
  axios.delete(`${BASE_URL}/delete`, { params: { id } });

export const updateCategory = (category) =>
  axios.put(`${BASE_URL}/update`, category);
