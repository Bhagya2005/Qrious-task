import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:4000/api'; 

export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const register = (data: any) =>
  api.post('/auth/register', data);

export const getMe = () => api.post('/auth/me', {}); 

