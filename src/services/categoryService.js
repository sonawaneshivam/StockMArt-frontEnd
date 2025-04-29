import axios from "axios";

const BASE_URL = "http://localhost:8080/category";
export const addCategory = async (formData) => {
  const response = await axios.post(`${BASE_URL}/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/showAll`);
    console.log("Fetched Categories:", response.data);  
    return response.data; 
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;  // Throw the error so you can handle it in the component
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    // Make sure to send the categoryId as a query parameter in the URL
    const response = await axios.delete(`${BASE_URL}/delete?id=${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error deleting category", error);
    throw error;
  }
};

export const updateCategory = async (id, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/update?id=${id}`, {
      method: 'PUT', // Ensure it's a PUT request
      body: formData,
    });
    return await response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

