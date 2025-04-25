import axios from "axios";

const BASE_URL = "http://localhost:8080/category";

export const addCategory = (category) =>
  axios.post(`${BASE_URL}/add`, category);

export const getAllCategories = () =>
  axios.get(`${BASE_URL}/showAll`);

export const deleteCategory = (id) =>
  axios.delete(`${BASE_URL}/delete`, { params: { id } });

export const updateCategory = (category) =>
  axios.put(`${BASE_URL}/update`, category);
