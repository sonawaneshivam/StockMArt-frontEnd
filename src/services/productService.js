// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Your backend API URL

// Add a new product to the database
export const addProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('p_name', productData.p_name);
    formData.append('p_description', productData.p_description);
    formData.append('category_id', productData.category_id);
    formData.append('p_price', productData.p_price);
    formData.append('stock', productData.stock);
    formData.append('image', productData.image);

    const response = await axios.post(`${BASE_URL}/product/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // To send form data (with file)
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product/showAll`);
      return response.data; // This should be a list of Stock (product) objects
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };