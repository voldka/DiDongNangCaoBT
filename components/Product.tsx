import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { productApi } from '../api/productApi';
import { Product as ProductType } from '../types/product';

interface ProductProps {
  onPress: (productId: string) => void;
  category?: string;  // Add this line
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const Product: React.FC<ProductProps> = ({ onPress, category }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAllProducts();
        if (response.status === 'OK') {
         
          let productData = response.data.productData;
          if (category) {
            productData = productData.filter(product => product.type._id === category);
          }
          setProducts(productData);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // Add category to dependency array

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
          <TouchableOpacity 
            key={product._id} 
            style={styles.productCard}
            onPress={() => onPress(product._id)}
          >
            <Image
              source={{ uri: product.image[0] }}
              style={styles.productImage}
            />
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <View style={styles.priceContainer}>
              {product.discount > 0 ? (
                <>
                  <Text style={styles.discountedPrice}>
                    {formatVND((product.price * (100 - product.discount)) / 100)}
                  </Text>
                  <Text style={styles.originalPrice}>{formatVND(product.price)}</Text>
                </>
              ) : (
                <Text style={styles.productPrice}>{formatVND(product.price)}</Text>
              )}
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>⭐ {Number(product.rating.$numberDecimal).toFixed(1)}</Text>
              <Text style={styles.statsText}>Sold: {product.selled}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    height: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productPrice: {
    fontSize: 14,  // Slightly smaller to accommodate longer VND format
    color: '#ee4d2d',
    fontWeight: 'bold',
  },
  discountedPrice: {
    fontSize: 14,  // Slightly smaller to accommodate longer VND format
    color: '#ee4d2d',
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 11,  // Slightly smaller to accommodate longer VND format
    color: '#666',
    textDecorationLine: 'line-through',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Product;