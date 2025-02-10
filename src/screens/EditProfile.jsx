import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // Save profile information logic here
    navigation.goBack();
  };

  return (
    <View>
      <Text>Edit Profile</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Save"
        onPress={handleSave}
      />
    </View>
  );
};

export default EditProfile;
