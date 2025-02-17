import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Product from '../../components/Product';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { products as allProducts, Product as ProductType } from '../../data/mockData';

export default function ListProductScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    if (category) {
      setProducts(allProducts.filter(product => product.category === category));
    }
  }, [category]);

  return (
    <>
      {/* <SafeAreaView style={styles.safeArea}> */}
      {/* <Header /> */}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {products.map(product => (
          <Product 
            key={product.id} 
            product={product} 
            onPress={() => handleProductPress(product.id)} 
          />
        ))}
      </ScrollView>
      {/* </SafeAreaView> */}
    </>
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
