import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InputItem, Button, Toast } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const { t } = useTranslation();

  const handleResetPassword = () => {
    if (!email) {
      Toast.fail(t('errors.requiredField') + ': ' + t('common.email'));
      return;
    }
    
    // Handle password reset logic here
    Toast.success(t('auth.resetInstructionsSent'));
    router.push('/login');
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

        <Icon name="lock" size={50} style={styles.icon} />
        <Text style={styles.title}>{t('auth.resetPassword')}</Text>
        <Text style={styles.subtitle}>
          {t('auth.resetInstructions')}
        </Text>

        <InputItem
          placeholder={t('common.email')}
          value={email}
          onChange={value => setEmail(value)}
          style={styles.input}
        />

        <Button 
          type="primary" 
          onPress={handleResetPassword}
          style={styles.button}
        >
          {t('auth.sendResetLink')}
        </Button>

        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.loginLink}
        >
          <Text style={styles.linkText}>{t('common.back')}</Text>
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
