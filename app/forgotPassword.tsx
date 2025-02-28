import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InputItem, Button, Toast } from '@ant-design/react-native';
import { IconOutline } from '@ant-design/icons-react-native';
import { router } from 'expo-router';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');

  const handleResetPassword = () => {
    if (!email) {
      Toast.fail('Please enter your email');
      return;
    }
    
    // Handle password reset logic here
    Toast.success('Reset instructions sent to your email');
    router.push('/login');
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

        <IconOutline name="lock" size={50} style={styles.icon} />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you instructions to reset your password
        </Text>

        <InputItem
          placeholder="Email"
          value={email}
          onChange={value => setEmail(value)}
          style={styles.input}
        />

        <Button 
          type="primary" 
          onPress={handleResetPassword}
          style={styles.button}
        >
          Send Reset Link
        </Button>

        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.loginLink}
        >
          <Text style={styles.linkText}>Back to Login</Text>
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
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
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

export default ForgotPassword;
