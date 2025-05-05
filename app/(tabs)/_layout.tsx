import { Tabs, useSegments } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useAuth from '@/hooks/useAuth';
import LanguageSelector from '@/components/LanguageSelector';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const segments = useSegments();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập mỗi khi component render hoặc khi điều hướng thay đổi
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      setIsLoggedIn(!!userInfo);
    };
    
    checkLoginStatus();
  }, [segments]); // Re-run whenever routing changes

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* <View style={styles.header}>
        <LanguageSelector style={styles.languageSelector} />
      </View> */}
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors['light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('common.home'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: t('common.cart'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size} color={color} />
            ),
            href: isLoggedIn ? undefined : null,
          }}
        />
        <Tabs.Screen
          name="orderHistory"
          options={{
            title: t('common.history'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
            // Hoàn toàn vô hiệu hóa tab khi người dùng không đăng nhập
            href: isLoggedIn ? undefined : null,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageSelector: {
    marginLeft: 'auto',
  }
});
