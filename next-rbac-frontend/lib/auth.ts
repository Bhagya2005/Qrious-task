import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:4000/api'; 

export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const register = (data: any) =>
  api.post('/auth/register', data);

// export const getMe = async () => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) return Promise.reject("No token found");

//   return  axios.post(`${API_URL}/auth/me`, {
//     headers: { 
//       Authorization: `Bearer ${token}` 
//     }
//   });
// };


export const getMe = () => api.post('/auth/me', {}); 

