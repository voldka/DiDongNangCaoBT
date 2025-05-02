import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { List, WhiteSpace, WingBlank, Button, Text } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { UserInfo } from '../types/user';

export default function ProfileScreen() {
  const [user, setUser] = useState<UserInfo | null>(null);

  const loadUserData = async () => {
    try {
  

      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const userData: UserInfo = JSON.parse(userInfo);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data');
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: user?.avatar || 'https://placeimg.com/100/100/people' }}
            />
            <Text style={styles.name}>{user?.name || 'User Name'}</Text>
          </View>

          <List>
            <List.Item extra={user?.email}>Email</List.Item>
            <List.Item extra={user?.phone}>Phone</List.Item>
            <List.Item extra={user?.address}>Address</List.Item>
          </List>

          <WhiteSpace size="lg" />
          
          <Button
            type="primary"
            onPress={() => router.push('/editProfile')}
            style={styles.button}
          >
            Edit Profile
          </Button>

          <WhiteSpace size="sm" />

          <Button
            onPress={() => router.push('/changePassword')}
            style={styles.button}
          >
            Change Password
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
