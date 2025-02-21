import { axiosInstance } from './axiosConfig';

export const userApi = {
  // Authentication
  signUp: (userData: any) => 
    axiosInstance.post('/api/user/sign-up', userData),
  
  signIn: (credentials: { email: string; password: string }) =>
    axiosInstance.post('/api/user/sign-in', credentials),
  
  logOut: (userId: string) =>
    axiosInstance.get(`/api/user/log-out/${userId}`),
  
  // Password management
  forgotPassword: (email: string) =>
    axiosInstance.post('/api/user/forgot-password', { email }),
  
  resetPassword: (userId: string, token: string, newPassword: string) =>
    axiosInstance.post(`/api/user/password-reset/${userId}/${token}`, { newPassword }),
  
  changePassword: (data: { userId: string; oldPassword: string; newPassword: string }) =>
    axiosInstance.post('/api/user/change-password', data),
  
  // User management
  updateUser: (userId: string, formData: FormData) =>
    axiosInstance.put(`/api/user/update-user/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getUserDetails: (userId: string) =>
    axiosInstance.get(`/api/user/get-details/${userId}`),
  
  refreshToken: (refreshToken: string) =>
    axiosInstance.post('/api/user/refresh-token', { refreshToken }),
  
  // User listing
  getUsersByRating: () =>
    axiosInstance.get('/api/user/get-by-rating'),
  
  getAllUsers: () =>
    axiosInstance.get('/api/user/getAll'),
  
  getAllDeletedUsers: () =>
    axiosInstance.get('/api/user/getAllDeleted'),
  
  // User deletion
  deleteUser: (userId: string) =>
    axiosInstance.delete(`/api/user/delete-user/${userId}`),
  
  deleteMany: (userIds: string[]) =>
    axiosInstance.post('/api/user/delete-many', { userIds }),
};

export default userApi;
