import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Form, InputItem, Button, Toast } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import userApi from '../api/userApi';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const SignUpScreen = () => {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.password || !form.confirmPassword) {
      Toast.fail(t('auth.fillAllFields'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      Toast.fail(t('auth.passwordsDontMatch'));
      return;
    }
    
    setLoading(true);
    try {
      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password
      };

      await userApi.signUp(userData);
      Toast.success(t('auth.signUpSuccess'));
      router.push('/login');
    } catch (error: any) {
      Toast.fail(error.response?.data?.message || t('auth.signUpFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#1890ff" />
          </TouchableOpacity>
          
          <LanguageSelector />
        </View>

        <Icon name="person-add" size={50} style={styles.icon} />
        <Text style={styles.title}>{t('auth.createAccount')}</Text>

        <InputItem
          placeholder={t('cart.fullName')}
          value={form.name}
          onChange={value => setForm({ ...form, name: value })}
          style={styles.input}
        />
        <InputItem
          placeholder={t('common.email')}
          value={form.email}
          onChange={value => setForm({ ...form, email: value })}
          style={styles.input}
        />
        <InputItem
          placeholder={t('cart.phone')}
          value={form.phone}
          onChange={value => setForm({ ...form, phone: value })}
          style={styles.input}
        />
        <InputItem
          placeholder={t('cart.deliveryAddress')}
          value={form.address}
          onChange={value => setForm({ ...form, address: value })}
          style={styles.input}
        />
        <InputItem
          type="password"
          placeholder={t('common.password')}
          value={form.password}
          onChange={value => setForm({ ...form, password: value })}
          style={styles.input}
        />
        <InputItem
          type="password"
          placeholder={t('common.confirmPassword')}
          value={form.confirmPassword}
          onChange={value => setForm({ ...form, confirmPassword: value })}
          style={styles.input}
        />

        <Button 
          type="primary" 
          onPress={handleSignUp}
          style={styles.button}
          loading={loading}
        >
          {t('common.register')}
        </Button>

        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.loginLink}
        >
          <Text style={styles.linkText}>{t('common.alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  icon: {
    marginTop: 10,
    marginBottom: 20,
    color: '#1890ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    height: 45,
  },
  loginLink: {
    marginTop: 10,
  },
  linkText: {
    color: '#1890ff',
    fontSize: 14,
  },
});

export default SignUpScreen;
