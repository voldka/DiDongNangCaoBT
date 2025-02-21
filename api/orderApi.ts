import { axiosInstance } from './axiosConfig';

export interface OrderPaymentIntent {
  amount: number;
  currency: string;
}

export interface OrderRate {
  rating: number;
  comment?: string;
}

export const orderApi = {
  // Create payment intent
  createPaymentIntent: (data: OrderPaymentIntent) => {
    return axiosInstance.post('/api/order/payment_intents', data);
  },

  // Get orders by user ID
  getOrdersByUserId: (userId: string) => {
    return axiosInstance.get(`/api/order/users/${userId}`);
  },

  // Rate a product in an order
  rateOrder: (orderId: string, ratingData: OrderRate) => {
    return axiosInstance.patch(`/api/order/${orderId}/rate`, ratingData);
  },

  // Update order
  updateOrder: (orderId: string, updateData: any) => {
    return axiosInstance.patch(`/api/order/${orderId}`, updateData);
  },

  // Check stock availability
  checkStock: (products: Array<{ productId: string; quantity: number }>) => {
    return axiosInstance.post('/api/order/check_stock', { products });
  },

  // Create new order
  createOrder: (orderData: any) => {
    return axiosInstance.post('/api/order', orderData);
  },

  // Get all orders
  getAllOrders: () => {
    return axiosInstance.get('/api/order');
  }
};
