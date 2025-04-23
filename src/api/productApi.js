import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';

export const getProducts = (page = 1, limit = 5) => axios.get(`${BASE_URL}?page=${page}&limit=${limit}`);
export const getProductById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createProduct = (product) => axios.post(BASE_URL, product);
export const updateProduct = (id, product) => axios.put(`${BASE_URL}/${id}`, product);
export const deleteProduct = (id) => axios.delete(`${BASE_URL}/${id}`);
export const searchProducts = (name) => axios.get(`${BASE_URL}/search?name=${name}`);
