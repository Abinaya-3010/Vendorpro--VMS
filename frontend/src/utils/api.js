import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const vendorAPI = {
  getAll: (params) => API.get('/vendors', { params }),
  getOne: (id) => API.get(`/vendors/${id}`),
  create: (data) => API.post('/vendors', data),
  update: (id, data) => API.put(`/vendors/${id}`, data),
  delete: (id) => API.delete(`/vendors/${id}`),
};

export const rfqAPI = {
  getAll: () => API.get('/rfqs'),
  getOne: (id) => API.get(`/rfqs/${id}`),
  create: (data) => API.post('/rfqs', data),
  update: (id, data) => API.put(`/rfqs/${id}`, data),
  send: (id, vendorIds) => API.post(`/rfqs/${id}/send`, { vendorIds }),
  delete: (id) => API.delete(`/rfqs/${id}`),
};

export const quotationAPI = {
  getAll: (params) => API.get('/quotations', { params }),
  getOne: (id) => API.get(`/quotations/${id}`),
  submit: (data) => API.post('/quotations', data),
  compare: (rfqId) => API.get(`/quotations/compare/${rfqId}`),
  select: (id) => API.post(`/quotations/${id}/select`),
};

export const poAPI = {
  getAll: (params) => API.get('/purchase-orders', { params }),
  getOne: (id) => API.get(`/purchase-orders/${id}`),
  create: (data) => API.post('/purchase-orders', data),
  updateStatus: (id, status) => API.patch(`/purchase-orders/${id}/status`, { status }),
  delete: (id) => API.delete(`/purchase-orders/${id}`),
};

export const invoiceAPI = {
  getAll: (params) => API.get('/invoices', { params }),
  getOne: (id) => API.get(`/invoices/${id}`),
  create: (data) => API.post('/invoices', data),
  updateStatus: (id, status) => API.patch(`/invoices/${id}/status`, { status }),
  delete: (id) => API.delete(`/invoices/${id}`),
};

export const inventoryAPI = {
  getAll: () => API.get('/inventory'),
  getOne: (id) => API.get(`/inventory/${id}`),
  receive: (data) => API.post('/inventory', data),
  update: (id, data) => API.put(`/inventory/${id}`, data),
};

export default API;
