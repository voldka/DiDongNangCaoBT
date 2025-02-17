import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { InputItem, Button, List, WhiteSpace, WingBlank, Toast } from '@ant-design/react-native';
import { mockUser as initialMockUser } from '@/data/mockData'; // Import mock user data

export default function ProfileScreen() {
  const [user, setUser] = useState(initialMockUser);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = () => {
    if (newPassword && newPassword !== confirmPassword) {
      Toast.fail('Passwords do not match', 1);
      return;
    }
    // Update the local mock user
    setUser({ ...user, name, email });
    // For simulation only – normally you would handle password updates separately.
    Toast.success('Profile updated successfully', 1);
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: user && user.avatar ? user.avatar : 'https://placeimg.com/100/100/people' }}
            />
          </View>
          {/* Form container with margin between inputs and bottom */}
          <View style={styles.formContainer}>
            <List>
              <InputItem
                clear
                value={name}
                onChange={setName}
                placeholder="Enter your name">
                Name
              </InputItem>
              <InputItem
                clear
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address">
                Email
              </InputItem>
              <InputItem
                clear
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Current Password">
                Current Password
              </InputItem>
              <InputItem
                clear
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="New Password">
                New Password
              </InputItem>
              <InputItem
                clear
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm New Password">
                Confirm Password
              </InputItem>
            </List>
          </View>
          <WhiteSpace size="lg" />
        </WingBlank>
      </ScrollView>
      {/* Fixed bottom update button */}
      <View style={styles.fixedButtonContainer}>
        <WingBlank size="lg">
          <Button type="primary" onPress={handleUpdateProfile}>
            Update Profile
          </Button>
        </WingBlank>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 100 }, // extra space so content not hidden behind button
  avatarContainer: { alignItems: 'center', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  formContainer: { marginTop: 20 }, // Added margin for spacing between avatar and form inputs
  fixedButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
  },
});
