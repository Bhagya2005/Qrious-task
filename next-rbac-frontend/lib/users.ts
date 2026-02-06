import api from './api';

export const getUsers = () => api.get('/users');
export const getUser = (id:number) => api.get(`/users/${id}`);
export const createUser = (data:any) => api.post('/users', data);
export const deleteUser = (id:number) => api.delete(`/users/${id}`);
export const assignRole = (uid:number, rid:number) =>
  api.patch(`/users/${uid}/assign-role/${rid}`);