import { axiosInstance } from './axiosConfig';

export interface CommentData {
  content: string;
  rating?: number;
  userId?: string;
  productId: string;
}

export interface UpdateCommentData {
  content?: string;
  rating?: number;
}

export const commentApi = {
  // Delete a comment
  removeComment: (commentId: string) => {
    return axiosInstance.delete(`/api/comment/remove/${commentId}`);
  },

  // Update a comment
  updateComment: (commentId: string, updateData: UpdateCommentData) => {
    return axiosInstance.patch(`/api/comment/update/${commentId}`, updateData);
  },

  // Get comments by product ID
  getCommentsByProduct: (productId: string) => {
    return axiosInstance.get(`/api/comment/products/${productId}`);
  },

  // Create a new comment
  createComment: (commentData: CommentData) => {
    return axiosInstance.post('/api/comment/create', commentData);
  }
};
