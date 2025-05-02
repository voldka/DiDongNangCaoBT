import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setIsSignedIn(!!token);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsSignedIn(false);
    setShowMenu(false);
    router.push('/login');
  };

  const handleAuthPress = () => {
    if (isSignedIn) {
      setShowMenu(true);
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

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                setShowMenu(false);
                router.push('/profile');
              }}
            >
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 60,
    marginRight: 16,
    borderRadius: 8,
    padding: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 12,
  },
  logoutText: {
    color: 'red',
  },
});

export default Header;