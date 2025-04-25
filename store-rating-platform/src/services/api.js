import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Add the /api prefix here

// API call to register a new user
export const registerUser = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);  // Corrected path
};

// API call to login a user
export const loginUser = (data) => {
  return axios.post(`${API_URL}/auth/login`, data);  // Corrected path
};

// API call to get the list of stores
export const getStores = () => {
  return axios.get(`${API_URL}/stores`);  // Corrected path
};

// API call to get the list of ratings for a store
export const getStoreRatings = (storeId) => {
  return axios.get(`${API_URL}/ratings/store/${storeId}`);  // Corrected path
};

// API call to submit a rating for a store
export const submitRating = (storeId, rating) => {
  return axios.post(`${API_URL}/ratings/submit`, { storeId, rating });  // Corrected path
};
