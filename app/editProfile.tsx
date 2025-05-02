import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { InputItem, Button, List, WhiteSpace, WingBlank, Toast } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userApi } from '../api/userApi';
import { router } from 'expo-router';
import { UserInfo } from '../types/user';

export default function EditProfileScreen() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [form, setForm] = useState<Partial<UserInfo>>({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const userData: UserInfo = JSON.parse(userInfo);
        setUser(userData);
        setForm({
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
        });
      }
    } catch (error) {
      Toast.fail('Error loading user data');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Toast.fail('User not found');
        return;
      }

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

  
      const response = await userApi.updateUser(userId, formData);
      
      // Update storage with new user info
      const userInfo = await AsyncStorage.getItem('userInfo');
      const currentUserInfo = userInfo ? JSON.parse(userInfo) : {};
      const updatedUserInfo = {
        ...currentUserInfo, 
        ...form,
      };
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  
      Toast.success('Profile updated successfully');
      router.back();
    } catch (error) {
      Toast.fail('Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <List>
        <InputItem
          clear
          value={form.name}
          onChange={value => setForm({ ...form, name: value })}
          placeholder="Enter your name">
          Name
        </InputItem>
        <InputItem
          clear
          value={form.phone}
          onChange={value => setForm({ ...form, phone: value })}
          placeholder="Enter your phone"
          keyboardType="phone-pad">
          Phone
        </InputItem>
        <InputItem
          clear
          value={form.address}
          onChange={value => setForm({ ...form, address: value })}
          placeholder="Enter your address">
          Address
        </InputItem>
      </List>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Button type="primary" onPress={handleUpdateProfile}>
          Save Changes
        </Button>
      </WingBlank>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
