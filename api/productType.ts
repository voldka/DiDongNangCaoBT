import axios from 'axios';

export interface ProductType {
  _id?: string;
  name: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BASE_URL = '/api/product-types';

export const productTypeApi = {
  getAll: async () => {
    const response = await axios.get<ProductType[]>(BASE_URL);
    return response.data;
  },

  getAllDeleted: async () => {
    const response = await axios.get<ProductType[]>(`${BASE_URL}/deleted`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await axios.post<ProductType>(
      `${BASE_URL}/create`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  update: async (productTypeId: string, data: FormData) => {
    const response = await axios.patch<ProductType>(
      `${BASE_URL}/update/${productTypeId}`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  delete: async (productTypeId: string) => {
    const response = await axios.delete<ProductType>(
      `${BASE_URL}/delete/${productTypeId}`
    );
    return response.data;
  }
};

