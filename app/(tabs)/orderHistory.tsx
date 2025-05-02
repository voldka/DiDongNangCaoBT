import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Card, WhiteSpace } from '@ant-design/react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { orderApi } from '../../api/orderApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample data as fallback
const sampleOrderData = [
  { id: '1', title: 'Order #1', date: '2023-09-01', address: '123 Main St', time: '10:30 AM', totalPrice: '$20.50', shop: 'Shop A' },
  { id: '2', title: 'Order #2', date: '2023-09-02', address: '456 Elm St', time: '1:15 PM', totalPrice: '$35.00', shop: 'Shop B' },
  // ...more sample orders...
];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color based on order status
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'đang xử lý':
        return '#f5a623'; // Orange
      case 'hoàn thành':
        return '#4cd964'; // Green
      case 'đã hủy':
        return '#ff3b30'; // Red
      default:
        return '#007aff'; // Blue
    }
  };

  // Use useFocusEffect instead of useEffect to refresh data on each navigation
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchOrders = async () => {
        try {
          setLoading(true);

          // Get userId from AsyncStorage
          const userId = await AsyncStorage.getItem('userId');

          if (userId) {
            // Only fetch orders if userId exists
            const data = await orderApi.getOrdersByUserId(userId);
        
        
            if (isActive) {
              setOrders(data?.data || []);
              setLoading(false);
              setError(null);
            }
          } else {
            // Handle case where userId is not found in AsyncStorage
            if (isActive) {
              setError("User not logged in. Please log in to view order history.");
              setLoading(false);
            }
          }
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          if (isActive) {
            setError("Failed to load order history");
            setLoading(false);
            // Fallback to sample data in case of error
            setOrders(sampleOrderData);
          }
        }
      };

      fetchOrders();

      // Clean up function to prevent state updates if the component unmounts
      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={() => router.push(`/order/${item._id}`)}>
              <Card style={styles.card}>
                <Card.Header 
                  title={`Order #${item._id.slice(-6)}`} 
                  extra={`Total: $${item.totalBill}`} 
                />
                <Card.Body>
                  <View style={styles.body}>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>Status:</Text>
                      <Text style={[styles.statusValue, { color: getStatusColor(item.orderStatus) }]}>
                        {item.orderStatus}
                      </Text>
                    </View>
                    
                    <Text style={styles.detail}>Date: {formatDate(item.createdAt)}</Text>
                    <Text style={styles.detail}>Payment: {item.paymentMethod}</Text>
                    <Text style={styles.detail}>Payment Status: {item.paymentStatus}</Text>
                    <Text style={styles.detail}>Delivery Status: {item.deliveryStatus}</Text>
                    
                    <Text style={styles.productsTitle}>Products:</Text>
                    {item.products.map((product, index) => (
                      product.amount > 0 && (
                        <View key={product._id} style={styles.productItem}>
                          {/* {product.image && (
                            <Image 
                              source={{ uri: product.image }} 
                              style={styles.productImage}
                              defaultSource={require('../../assets/images/placeholder.png')}
                            />
                          )} */}
                          <View style={styles.productDetails}>
                            <Text style={styles.productName}>{product.productName}</Text>
                            <Text style={styles.productInfo}>
                              Quantity: {product.amount} × ${product.price} = ${product.totalPrice}
                            </Text>
                          </View>
                        </View>
                      )
                    ))}
                  </View>
                </Card.Body>
              </Card>
            </TouchableOpacity>
            <WhiteSpace size="lg" />
          </>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: { borderRadius: 8, overflow: 'hidden' },
  body: { marginLeft: 16, paddingVertical: 8 },
  detail: { fontSize: 14, color: '#555', marginVertical: 2 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { color: 'red', marginBottom: 10, fontSize: 16 },
  statusRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  statusLabel: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginRight: 5 
  },
  statusValue: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  productsTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 5 
  },
  productItem: { 
    flexDirection: 'row', 
    marginVertical: 5, 
    padding: 5, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 5 
  },
  productImage: { 
    width: 40, 
    height: 40, 
    borderRadius: 4 
  },
  productDetails: { 
    marginLeft: 10, 
    flex: 1 
  },
  productName: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  productInfo: { 
    fontSize: 12, 
    color: '#666' 
  }
});
