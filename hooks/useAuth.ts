import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from '../api/userApi';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  const signIn = async (credentials) => {
    try {
      const response = await userApi.signIn(credentials);

      // Save tokens and user data to AsyncStorage
      await AsyncStorage.setItem('userToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      // Lưu userId riêng biệt như trong logic cũ
      await AsyncStorage.setItem('userId', response.data.id);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));

      // Update user state
      setUser(response.data);
      return response;
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear tokens and user data from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userInfo');
      // Xóa userId khi đăng xuất
      await AsyncStorage.removeItem('userId');

      // Update user state
      setUser(null);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  return { user, loading, signIn, signOut };
}
