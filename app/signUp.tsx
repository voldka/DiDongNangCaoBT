import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Form, InputItem, Button, Toast } from '@ant-design/react-native';
import { IconOutline } from '@ant-design/icons-react-native';
import { router } from 'expo-router';
import userApi from '../api/userApi';

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

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.password || !form.confirmPassword) {
      Toast.fail('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Toast.fail('Passwords do not match!');
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
      Toast.success('Sign up successful!');
      router.push('/login');
    } catch (error: any) {
      Toast.fail(error.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <IconOutline name="left" size={24} color="#1890ff" />
        </TouchableOpacity>

        <IconOutline name="user-add" size={50} style={styles.icon} />
        <Text style={styles.title}>Create Account</Text>

        <InputItem
          placeholder="Full Name"
          value={form.name}
          onChange={value => setForm({ ...form, name: value })}
          style={styles.input}
        />
        <InputItem
          placeholder="Email"
          value={form.email}
          onChange={value => setForm({ ...form, email: value })}
          style={styles.input}
        />
        <InputItem
          placeholder="Phone Number"
          value={form.phone}
          onChange={value => setForm({ ...form, phone: value })}
          style={styles.input}
        />
        <InputItem
          placeholder="Address"
          value={form.address}
          onChange={value => setForm({ ...form, address: value })}
          style={styles.input}
        />
        <InputItem
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={value => setForm({ ...form, password: value })}
          style={styles.input}
        />
        <InputItem
          type="password"
          placeholder="Confirm Password"
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
          Sign Up
        </Button>

        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.loginLink}
        >
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  icon: {
    marginTop: 30,
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
