import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { InputItem, Button } from '@ant-design/react-native';
import { IconOutline } from '@ant-design/icons-react-native';
import { router } from 'expo-router';
import { userApi } from '../api/userApi';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = React.useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userApi.signIn(form);
      // Handle successful login here, e.g., store token, redirect
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <IconOutline name="user" size={50} style={styles.icon} />
        <Text style={styles.title}>Welcome Back</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <InputItem
          placeholder="Email"
          value={form.email}
          onChange={value => setForm({ ...form, email: value })}
          style={styles.input}
        />
        <InputItem
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={value => setForm({ ...form, password: value })}
          style={styles.input}
        />

        <Button
          type="primary"
          onPress={onSignIn}
          style={styles.button}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : 'Sign In'}
        </Button>

        <View style={styles.links}>
          <TouchableOpacity onPress={() => router.push('/signUp')}>
            <Text style={styles.linkText}>Create new account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
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
  icon: {
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
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  linkText: {
    color: '#1890ff',
    fontSize: 14,
    marginHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Login;
