import { axiosInstance } from './axiosConfig';

interface CartItem {
  _id?: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  amount: number;
  totalPrice: number;
}

interface CartUpdateData {
  products: CartItem[];
}

export const cartApi = {
  getCartByUserId: async (userId) => {
    const response = await axiosInstance.get(`/api/cart/users/${userId}`);

    return response.data;
  },

  updateCart: async (userId: string, data: CartUpdateData) => {

    
    const response = await axiosInstance.patch(`/api/cart/users/${userId}`, data);

    return response.data;
  }
};
