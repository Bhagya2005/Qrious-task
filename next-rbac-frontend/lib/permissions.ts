import api from './api';

export const getPermissions = () =>
  api.get('/permissions').then(res => res.data.data);

export const createPermission = (data: {
  resource: string;
  action: string;
}) =>
  api.post('/permissions', data).then(res => res.data.data);
  

  console.log(createPermission)

export const deletePermission = (id: number) =>
  api.delete(`/permissions/${id}`);
