// utils/axios.js
import axios from 'axios';
import { getToken } from './auth'; // Adjust the import path as needed

const request = axios.create({
  baseURL: 'https://lactobloom-api-arcfcafeh5ejabaa.eastus-01.azurewebsites.net/', // Adjust the base URL as needed
});

request.interceptors.request.use(
  (config: any) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;