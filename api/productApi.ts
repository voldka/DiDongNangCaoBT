import { axiosInstance } from './axiosConfig';
import { Product, RatingRequest } from '../types/product';

export const productApi = {
  ratingProduct: (userId: string, productId: string, data: RatingRequest) => {
    return axiosInstance.post(`/api/product/rating/${userId}/${productId}`, data);
  },

  createProduct: (formData: FormData) => {
    return axiosInstance.post('/api/product/create', formData);
  },

  updateProduct: (productId: string, formData: FormData) => {
    return axiosInstance.put(`/api/product/update/${productId}`, formData);
  },

  deleteProduct: (productId: string) => {
    return axiosInstance.delete(`/api/product/delete/${productId}`);
  },

  deleteMany: (productIds: string[]) => {
    return axiosInstance.post(`/api/product/delete-many`, { productIds });
  },

  getDetailsProduct: (productId: string) => {
    return axiosInstance.get(`/api/product/get-details/${productId}`);
  },

  getRelevantProducts: (productId: string) => {
    return axiosInstance.get(`/api/product/get-relevant-products/${productId}`);
  },

  getAllProducts: () => {
    return axiosInstance.get(`/api/product/get-all`);
  },

  getAllDeletedProducts: () => {
    return axiosInstance.get(`/api/product/get-all-deleted`);
  },

  getAllTypes: () => {
    return axiosInstance.get(`/api/product/get-all-type`);
  }
};
