import { axiosInstance } from './axiosConfig';

export const userApi = {
  // Authentication
  signUp: (userData: any) => 
    axiosInstance.post('/api/user/sign-up', userData).then(response => response.data),
  
  signIn: (credentials: { email: string; password: string }) =>
    axiosInstance.post('/api/user/sign-in', credentials).then(response => response.data),
  
  logOut: (userId: string) =>
    axiosInstance.get(`/api/user/log-out/${userId}`).then(response => response.data),
  
  // Password management
  forgotPassword: (email: string) =>
    axiosInstance.post('/api/user/forgot-password', { email }).then(response => response.data),
  
  resetPassword: (userId: string, token: string, newPassword: string) =>
    axiosInstance.post(`/api/user/password-reset/${userId}/${token}`, { newPassword })
      .then(response => response.data),
  
  changePassword: (data: { userId: string; oldPassword: string; newPassword: string }) =>
    axiosInstance.post('/api/user/change-password', data).then(response => response.data),
  
  // User management
  updateUser: (userId: string, formData: FormData) =>
    axiosInstance.put(`/api/user/update-user/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => response.data),
  
  getUserDetails: (userId: string) =>
    axiosInstance.get(`/api/user/get-details/${userId}`).then(response => response.data),
  
  refreshToken: (refreshToken: string) =>
    axiosInstance.post('/api/user/refresh-token', { refreshToken }).then(response => response.data),
  
  // User listing
  getUsersByRating: () =>
    axiosInstance.get('/api/user/get-by-rating').then(response => response.data),
  
  getAllUsers: () =>
    axiosInstance.get('/api/user/getAll').then(response => response.data),
  
  getAllDeletedUsers: () =>
    axiosInstance.get('/api/user/getAllDeleted').then(response => response.data),
  
  // User deletion
  deleteUser: (userId: string) =>
    axiosInstance.delete(`/api/user/delete-user/${userId}`).then(response => response.data),
  
  deleteMany: (userIds: string[]) =>
    axiosInstance.post('/api/user/delete-many', { userIds }).then(response => response.data),
};

export default userApi;
