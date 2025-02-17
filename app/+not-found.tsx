import { Href, Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Rất tiếc! Không tìm thấy' }} />
      <View style={styles.container}>
        <Text style={styles.text}>Không tìm thấy trang</Text>
        <Link href={"/" as Href} style={styles.button}>
          Quay về trang chủ!
        </Link>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
