import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:3001/api"; // Replace this with your actual backend URL

export const getUserRole = async () => {
  try {
    const response = await axios.get(`${API_URL}/userRole`, {
      withCredentials: true 
    });  
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

export const getFarmersApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/farmers`);    
    return response.data;
  } catch (error) {
    console.error("Error fetching farmers:", error);
    throw error;
  }
};



export const addFarmerApi = async (newFarmer) => {
  try {
    console.log(newFarmer);
    const response = await axios.post(`${API_URL}/farmers`, newFarmer);
    return response.data;
  } catch (error) {
    console.error("Error adding farmer:", error);
    throw error;
  }
};

export const editFarmerApi = async (id, editedFarmer) => {
  try {
    const response = await axios.put(`${API_URL}/farmers/${id}`, editedFarmer);
    return response.data;
  } catch (error) {
    console.error("Error editing farmer:", error);
    throw error;
  }
};

// export const editFarmerApi = async (id, editedFarmer) => {
//   try {
//     const response = await axios.patch(`${API_URL}/farmers/${id}`, editedFarmer);
//     return response.data;
//   } catch (error) {
//     console.error("Error editing farmer:", error);
//     throw error;
//   }
// };

export const deleteFarmerApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/farmers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting farmer:", error);
    throw error;
  }
};

export const getItemApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Item:", error);
    throw error;
  }
};

export const addItemApi = async (newItem) => {
  try {
    const response = await axios.post(`${API_URL}/items`, newItem);
    return response.data;
  } catch (error) {
    console.error("Error adding Item:", error);
    throw error;
  }
};

export const editItemApi = async (id, editedItem) => {
  try {
    const response = await axios.put(`${API_URL}/items/${id}`, editedItem);
    return response.data;
  } catch (error) {
    console.error("Error editing Item:", error);
    throw error;
  }
};

export const deleteItemApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Item:", error);
    throw error;
  }
};

export const getSupplyApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/supplies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplies:", error);
    throw error;
  }
};

export const addSupplyApi = async (newSupply) => {
  try {
    console.log(newSupply);
    const response = await axios.post(`${API_URL}/supplies`, newSupply);
    return response.data;
  } catch (error) {
    console.error("Error adding supply:", error);
    throw error;
  }
};

export const editSupplyApi = async (id, editedSupply) => {
  try {
    const response = await axios.put(`${API_URL}/supplies/${id}`, editedSupply);
    return response.data;
  } catch (error) {
    console.error("Error editing supply:", error);
    throw error;
  }
};

export const deleteSupplyApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/supplies/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting supply:", error);
    throw error;
  }
};

export const getProductApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Products:", error);
    throw error;
  }
};

export const addProductApi = async (newProduct) => {
  try {
    const response = await axios.post(`${API_URL}/products`, newProduct);
    return response.data;
  } catch (error) {
    console.error("Error adding Product:", error);
    throw error;
  }
};

export const editProductApi = async (id, editedProduct) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, editedProduct);
    return response.data;
  } catch (error) {
    console.error("Error editing Product:", error);
    throw error;
  }
};

export const deleteProductApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Product:", error);
    throw error;
  }
};

export const getCollectionsApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/collections`);
    return response.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

export const addCollectionApi = async (newCollection) => {
  try {
    const response = await axios.post(`${API_URL}/collections`, newCollection);
    return response.data;
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
};

export const editCollectionApi = async (id, editedCollection) => {
  try {
    const response = await axios.put(`${API_URL}/collections/${id}`, editedCollection);
    return response.data;
  } catch (error) {
    console.error("Error editing collection:", error);
    throw error;
  }
};

export const deleteCollectionApi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/collections/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};


export const getStatusesApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching status entries:", error);
    throw error;
  }
};

export const addStatusApi = async (newStatus) => {
  try {
    const formData = new FormData();
    formData.append('farmerId', newStatus.farmerId);
    formData.append('date', newStatus.date);
    formData.append('identifiedIssues', JSON.stringify(newStatus.identifiedIssues));
    formData.append('neededResources', JSON.stringify(newStatus.neededResources));
    formData.append('ribbonCount', JSON.stringify(newStatus.ribbonCount)); 
    formData.append('inputActivity', newStatus.inputActivity);
    formData.append('inputUsedQuantity', newStatus.inputUsedQuantity);
    formData.append('inputUsedCost', newStatus.inputUsedCost);
    formData.append('machineryHours', newStatus.machineryHours);
    formData.append('machineryCost', newStatus.machineryCost);
    formData.append('labourHours', newStatus.labourHours);
    formData.append('labourCost', newStatus.labourCost);
    formData.append('soldAtEventsQuantity', newStatus.soldAtEventsQuantity);
    formData.append('soldAtEventsIncome', newStatus.soldAtEventsIncome);
    formData.append('destroyedQuantity', newStatus.destroyedQuantity);
    formData.append('soldLocallyQuantity', newStatus.soldLocallyQuantity);
    formData.append('soldLocallyIncome', newStatus.soldLocallyIncome);
    formData.append('comments', newStatus.comments);

    if (newStatus.photos && newStatus.photos.length > 0) {
      for (let i = 0; i < newStatus.photos.length; i++) {
        formData.append('photos', newStatus.photos[i]);
      }
    }

    const response = await axios.post(`${API_URL}/status`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding status entry:", error);
    throw error;
  }
};


export const LoginApi = async (inputs) => {
  try {
      const response = await axios.post(`${API_URL}/login`, inputs);
      document.cookie = `token=${response.data.token}; path=/`;

      return response.data;
  } catch (error) {
      throw error;
  }
};