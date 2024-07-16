import axios from 'axios';

const API_URL = "http://localhost:3001/api"; // Replace with your actual API URL

export const updateRibbonCountApi = async (farmerId, ribbonCount) => {
  try {
    const response = await axios.put(`${API_URL}/ribbonCount/${farmerId}`, ribbonCount);
    return response.data;
  } catch (error) {
    console.error('Error updating ribbon count:', error);
    throw error;
  }
};
