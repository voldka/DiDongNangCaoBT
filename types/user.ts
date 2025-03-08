export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  access_token: string;
  accessToken: string;
  refreshToken: string;
  address: string;
  isAdmin: boolean;
  user: User;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  isAdmin: boolean;
}
