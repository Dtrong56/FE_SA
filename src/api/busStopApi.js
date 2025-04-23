import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/busstop';

export const busStopApi = {
  // CREATE
  createBusStop: async (busStopData) => {
    try {
      const response = await axios.post(API_URL, busStopData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // READ
  getAllBusStops: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBusStopById: async (idBusStop) => {
    try {
      const response = await axios.get(`${API_URL}/${idBusStop}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // UPDATE
  updateBusStop: async (idBusStop, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${idBusStop}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE
  deleteBusStop: async (idBusStop) => {
    try {
      const response = await axios.delete(`${API_URL}/${idBusStop}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default busStopApi;