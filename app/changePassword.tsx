import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { InputItem, Button, List, WhiteSpace, WingBlank, Toast } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userApi } from '../api/userApi';
import { router } from 'expo-router';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Toast.fail('Passwords do not match');
        return;
      }

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Toast.fail('User not found');
        return;
      }

      await userApi.changePassword({
        userId,
        oldPassword: currentPassword,
        newPassword
      });

      Toast.success('Password changed successfully');
      router.back();
    } catch (error) {
      Toast.fail('Failed to change password');
    }
  };

  return (
    <View style={styles.container}>
      <List>
        <InputItem
          clear
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Enter current password">
          Current Password
        </InputItem>
        <InputItem
          clear
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Enter new password">
          New Password
        </InputItem>
        <InputItem
          clear
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm new password">
          Confirm Password
        </InputItem>
      </List>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Button type="primary" onPress={handleChangePassword}>
          Change Password
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
