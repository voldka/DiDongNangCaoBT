import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Card, WhiteSpace } from '@ant-design/react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { orderApi } from '../../api/orderApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';

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
  const { t } = useTranslation();

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
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
              setError(t('orderHistory.loginRequired'));
              setLoadin
              g(false);
            }
          }
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          if (isActive) {
            setError(t('errors.fetchFailed'));
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
    }, [t])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>{t('orderHistory.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('orderHistory.yourOrders')}</Text>
        <LanguageSelector />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {orders.length === 0 && !error ? (
        <Text style={styles.noOrdersText}>{t('orderHistory.noOrders')}</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity onPress={() => router.push(`/order/${item._id}`)}>
                <Card style={styles.card}>
                  <Card.Header 
                    title={`${t('orderHistory.order')} #${item._id ? item._id.slice(-6) : null}`} 
                    extra={`${t('cart.total')}: ${item.totalBill}đ`} 
                  />
                  <Card.Body>
                    <View style={styles.body}>
                      <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>{t('orderHistory.orderStatus')}:</Text>
                        <Text style={[styles.statusValue, { color: getStatusColor(item.orderStatus) }]}>
                          {item.orderStatus}
                        </Text>
                      </View>
                      
                      <Text style={styles.detail}>{t('orderHistory.orderDate')}: {formatDate(item.createdAt)}</Text>
                      <Text style={styles.detail}>{t('orderHistory.paymentMethod')}: {item.paymentMethod}</Text>
                      <Text style={styles.detail}>{t('orderHistory.paymentStatus')}: {item.paymentStatus}</Text>
                      <Text style={styles.detail}>{t('orderHistory.deliveryStatus')}: {item.deliveryStatus}</Text>
                      
                      <Text style={styles.productsTitle}>{t('orderHistory.products')}:</Text>
                      {item.products.map((product, index) => (
                        product.amount > 0 && (
                          <View key={product._id || index} style={styles.productItem}>
                            <View style={styles.productDetails}>
                              <Text style={styles.productName}>{product.productName}</Text>
                              <Text style={styles.productInfo}>
                                {t('products.quantity')}: {product.amount} × {product.price}đ = {product.totalPrice}đ
                              </Text>
                            </View>
                          </View>
                        )
                      ))}
                    </View>
                  </Card.Body>
                  <Card.Footer
                    content=""
                    extra={
                      <TouchableOpacity onPress={() => router.push(`/order/${item._id}`)}>
                        <Text style={styles.viewDetailsText}>{t('orderHistory.viewDetails')}</Text>
                      </TouchableOpacity>
                    }
                  />
                </Card>
              </TouchableOpacity>
              <WhiteSpace size="lg" />
            </>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 20 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: { fontSize: 28, fontWeight: 'bold' },
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
  },
  noOrdersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50
  },
  viewDetailsText: {
    color: '#1890ff',
    fontSize: 14
  }
});
