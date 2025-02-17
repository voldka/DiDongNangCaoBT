// filepath: /app/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const router = useRouter();
  const isSignedIn = false; // Replace with your auth state management

  const handleAuthPress = () => {
    if (isSignedIn) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>LT Handmade</Text>
      <TouchableOpacity onPress={handleAuthPress}>
        <Ionicons 
          name={isSignedIn ? 'person-circle' : 'log-in-outline'} 
          size={24} 
          color="black" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;