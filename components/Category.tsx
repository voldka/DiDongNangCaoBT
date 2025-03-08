import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { productTypeApi, ProductType } from '../api/productType';

interface CategoryProps {
  onPress: (categoryId: string) => void;
}

const Category: React.FC<CategoryProps> = ({ onPress }) => {
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
      const response = await productTypeApi.getAll();
      
      if (response.status === 'OK') {
       
        setCategories(response.data);
      } else {
        console.error('Failed to fetch categories');
      }
      } catch (error) {
      console.error('An error occurred while fetching categories:', error);
      } finally {
      setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category._id} 
            style={styles.categoryItem}
            onPress={() => onPress(category._id!)}
          >
            <Text style={styles.categoryIcon}>🏷️</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
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
    marginBottom: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Category;