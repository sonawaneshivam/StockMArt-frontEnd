// src/services/userService.js
import axios from "axios";

const userService = async (userData) => {
  const response = await axios.post("http://localhost:8080/register/details", userData);
  return response.data;
};

export default userService;




export const loginUser = async (username, password) => {
  try {
    const response = await axios.get("http://localhost:8080/register/login", {
      params: { username, password },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

