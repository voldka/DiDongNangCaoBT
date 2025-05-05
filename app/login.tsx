import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { InputItem, Button } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import useAuth from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = React.useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const onSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn(form);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LanguageSelector />
      </View>
      <View style={styles.formContainer}>
        <Icon name="person" size={50} style={styles.icon} />
        <Text style={styles.title}>{t('auth.welcome')}</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <InputItem
          placeholder={t('common.email')}
          value={form.email}
          onChange={value => setForm({ ...form, email: value })}
          style={styles.input}
        />
        <InputItem
          type="password"
          placeholder={t('common.password')}
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
          {loading ? <ActivityIndicator color="#fff" /> : t('common.login')}
        </Button>

        <View style={styles.links}>
          <TouchableOpacity onPress={() => router.push('/signUp')}>
            <Text style={styles.linkText}>{t('common.createAccount')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
            <Text style={styles.linkText}>{t('common.forgotPassword')}</Text>
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
  header: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
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
