import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { InputItem, Button } from '@ant-design/react-native';
// Using Ant Design React Native icon (adjust import as needed)
import { IconOutline } from '@ant-design/icons-react-native';

const Login = () => {
  const [form, setForm] = React.useState({ username: '', password: '' });

  const onSignIn = () => {
    // ...handle sign in...
  };

  return (
    <>
      {/* <ImageBackground source={require('../../assets/bg.png')} style={styles.container}> */}
      <View style={styles.container}>
      {/* Form container for semi-transparent background */}
      <View style={styles.formContainer}>
        {/* Icon */}
        <IconOutline name="user" size={50} style={styles.icon} />
        {/* Title */}
        <Text style={styles.title}>LT handmade</Text>
        {/* Login form inputs without labels but with placeholders */}
        <InputItem
          placeholder="Username"
          value={form.username}
          onChange={value => setForm({ ...form, username: value })}
        />
        <InputItem
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={value => setForm({ ...form, password: value })}
        />
        {/* Sign In button */}
        <Button type="primary" onPress={onSignIn} style={styles.signInButton}>
          Sign In
        </Button>
        {/* Links for Sign Up and Forgot Password */}
        <View style={styles.links}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    {/* </ImageBackground> */}
    </>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // removed backgroundColor in favor of image
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // semi-transparent background
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
  },
  signInButton: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 8,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  linkText: {
    color: '#1890ff',
    fontSize: 14,
  },
});

export default Login;
