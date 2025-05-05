import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { InputItem, Button, List, WhiteSpace, WingBlank, Toast } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userApi } from '../api/userApi';
import { router } from 'expo-router';
import { UserInfo } from '../types/user';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LanguageSelector from '../components/LanguageSelector';

export default function EditProfileScreen() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [form, setForm] = useState<Partial<UserInfo>>({
    name: '',
    phone: '',
    address: '',
  });
  const { t } = useTranslation();

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
      Toast.fail(t('errors.loadingUserData'));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Toast.fail(t('errors.userNotFound'));
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
  
      Toast.success(t('profile.updateSuccess'));
      router.back();
    } catch (error) {
      Toast.fail(t('profile.errorUpdating'));
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

        <Text style={styles.title}>{t('profile.editProfile')}</Text>
        
        <LanguageSelector />
      </View>

      <List>
        <InputItem
          clear
          value={form.name}
          onChange={value => setForm({ ...form, name: value })}
          placeholder={t('profile.userName')}>
          {t('cart.fullName')}
        </InputItem>
        <InputItem
          clear
          value={form.phone}
          onChange={value => setForm({ ...form, phone: value })}
          placeholder={t('cart.phone')}
          keyboardType="phone-pad">
          {t('cart.phone')}
        </InputItem>
        <InputItem
          clear
          value={form.address}
          onChange={value => setForm({ ...form, address: value })}
          placeholder={t('cart.deliveryAddress')}>
          {t('cart.deliveryAddress')}
        </InputItem>
      </List>

      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Button type="primary" onPress={handleUpdateProfile}>
          {t('common.save')}
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
