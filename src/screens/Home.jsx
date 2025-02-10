import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Profile Information</Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </View>
  );
};

export default Home;
