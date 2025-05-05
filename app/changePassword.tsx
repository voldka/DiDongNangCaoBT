import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { InputItem, Button, List, WhiteSpace, WingBlank, Toast } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userApi } from '../api/userApi';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LanguageSelector from '../components/LanguageSelector';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation();

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Toast.fail(t('auth.passwordsDontMatch'));
        return;
      }

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Toast.fail(t('errors.userNotFound'));
        return;
      }

      await userApi.changePassword({
        userId,
        oldPassword: currentPassword,
        newPassword
      });

      Toast.success(t('profile.passwordChanged'));
      router.back();
    } catch (error) {
      Toast.fail(t('profile.errorChangingPassword'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#1890ff" />
        </TouchableOpacity>

        <Text style={styles.title}>{t('profile.changePassword')}</Text>
        
        <LanguageSelector />
      </View>

      <List>
        <InputItem
          clear
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder={t('profile.enterCurrentPassword')}>
          {t('profile.currentPassword')}
        </InputItem>
        <InputItem
          clear
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder={t('profile.enterNewPassword')}>
          {t('profile.newPassword')}
        </InputItem>
        <InputItem
          clear
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={t('profile.confirmNewPassword')}>
          {t('common.confirmPassword')}
        </InputItem>
      </List>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Button type="primary" onPress={handleChangePassword}>
          {t('profile.changePassword')}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
