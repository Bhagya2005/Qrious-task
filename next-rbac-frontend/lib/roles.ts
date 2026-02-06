import api from './api';

export const getRoles = () =>
  api.get('/roles').then(res => res.data.data);

export const createRole = (data: { name: string }) =>
  api.post('/roles', data).then(res => res.data.data);

export const deleteRole = (id: number) =>
  api.delete(`/roles/${id}`);
export const getRole = (id:number) => api.get(`/roles/${id}`);

export const removePermission = (rid:number, pid:number) =>
  api.delete(`/roles/${rid}/permissions/${pid}`);

export const assignPermissions = async (roleId: number, permissionId: number) => {
  return api.patch(`/roles/${roleId}/permissions`, { permissionId: Number(permissionId) });
};

