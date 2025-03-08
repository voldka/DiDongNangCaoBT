import { axiosInstance } from './axiosConfig';
import { Product, RatingRequest } from '../types/product';

export const productApi = {
  ratingProduct: (userId: string, productId: string, data: RatingRequest) => {
    return axiosInstance.post(`/api/product/rating/${userId}/${productId}`, data)
      .then(response => response.data);
  },

  createProduct: (formData: FormData) => {
    return axiosInstance.post('/api/product/create', formData)
      .then(response => response.data);
  },

  updateProduct: (productId: string, formData: FormData) => {
    return axiosInstance.put(`/api/product/update/${productId}`, formData)
      .then(response => response.data);
  },

  deleteProduct: (productId: string) => {
    return axiosInstance.delete(`/api/product/delete/${productId}`)
      .then(response => response.data);
  },

  deleteMany: (productIds: string[]) => {
    return axiosInstance.post(`/api/product/delete-many`, { productIds })
      .then(response => response.data);
  },

  getDetailsProduct: (productId: string) => {
    return axiosInstance.get(`/api/product/get-details/${productId}`)
      .then(response => response.data);
  },

  getRelevantProducts: (productId: string) => {
    return axiosInstance.get(`/api/product/get-relevant-products/${productId}`)
      .then(response => response.data);
  },

  getAllProducts: () => {
    return axiosInstance.get(`/api/product/get-all`)
      .then(response => response.data);
  },

  getAllDeletedProducts: () => {
    return axiosInstance.get(`/api/product/get-all-deleted`)
      .then(response => response.data);
  },

  getAllTypes: () => {
    return axiosInstance.get(`/api/product/get-all-type`)
      .then(response => response.data);
  }
};
