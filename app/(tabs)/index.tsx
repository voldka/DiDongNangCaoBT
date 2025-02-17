import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Category from '../../components/Category';
import Product from '../../components/Product';

const HomeScreen = () => {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    // router.push(`/category/${categoryId}`);
    router.push(`/list-product/${categoryId}`);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <>
    {/* <SafeAreaView style={styles.safeArea} edges={['top']}> */}
      <Header />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Category onPress={handleCategoryPress} />
        <Product onPress={handleProductPress} />
      </ScrollView>
    {/* </SafeAreaView> */}
    </>
    
  );
};

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

export default HomeScreen;
