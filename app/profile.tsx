import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { List, WhiteSpace, WingBlank, Button, Text } from '@ant-design/react-native';
import { router } from 'expo-router';
import useAuth from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LanguageSelector />
      </View>
      <ScrollView>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: user?.avatar || 'https://placeimg.com/100/100/people' }}
            />
            <Text style={styles.name}>{user?.name || t('profile.userName')}</Text>
          </View>

          <List>
            <List.Item extra={user?.email}>Email</List.Item>
            <List.Item extra={user?.phone}>{t('cart.phone')}</List.Item>
            <List.Item extra={user?.address}>{t('cart.deliveryAddress')}</List.Item>
          </List>

          <WhiteSpace size="lg" />
          
          <Button
            type="primary"
            onPress={() => router.push('/editProfile')}
            style={styles.button}
          >
            {t('profile.editProfile')}
          </Button>

          <WhiteSpace size="sm" />

          <Button
            onPress={() => router.push('/changePassword')}
            style={styles.button}
          >
            {t('profile.changePassword')}
          </Button>
          
          <WhiteSpace size="lg" />
          
          <Button
            type="warning"
            onPress={handleLogout}
            style={styles.button}
          >
            {t('common.logout')}
          </Button>
        </WingBlank>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'flex-end',
    padding: 10,
    marginTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
  },
});
