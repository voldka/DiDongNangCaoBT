import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Product from '../../components/Product';

export default function ListProductScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Product 
        onPress={handleProductPress}
        category={category}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
