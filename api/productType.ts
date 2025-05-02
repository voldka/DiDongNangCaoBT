import { axiosInstance } from './axiosConfig';

export interface ProductType {
  
  _id?: string;
  name: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
}

const BASE_URL = '/api/product-types';

export const productTypeApi = {
  getAll: async () => {
    const response = await axiosInstance.get<ProductType[]>(BASE_URL);
    return response.data;
  },

  getAllDeleted: async () => {
    const response = await axiosInstance.get<ProductType[]>(`${BASE_URL}/deleted`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await axiosInstance.post<ProductType>(
      `${BASE_URL}/create`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  update: async (productTypeId: string, data: FormData) => {
    const response = await axiosInstance.patch<ProductType>(
      `${BASE_URL}/update/${productTypeId}`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  delete: async (productTypeId: string) => {
    const response = await axiosInstance.delete<ProductType>(
      `${BASE_URL}/delete/${productTypeId}`
    );
    return response.data;
  }
};

