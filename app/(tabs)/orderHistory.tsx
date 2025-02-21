import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, WhiteSpace } from '@ant-design/react-native';
import { useRouter } from 'expo-router';

const orderHistoryData = [
  { id: '1', title: 'Order #1', date: '2023-09-01', address: '123 Main St', time: '10:30 AM', totalPrice: '$20.50', shop: 'Shop A' },
  { id: '2', title: 'Order #2', date: '2023-09-02', address: '456 Elm St', time: '1:15 PM', totalPrice: '$35.00', shop: 'Shop B' },
  // ...more sample orders...
];

export default function OrderHistoryScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orderHistoryData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={() => router.push(`/order/${item.id}`)}>
              <Card style={styles.card}>
                <Card.Header title={item.title} extra={`Total: ${item.totalPrice}`} />
                <Card.Body>
                  <View style={styles.body}>
                    <Text style={styles.detail}>Date: {item.date}</Text>
                    <Text style={styles.detail}>Time: {item.time}</Text>
                    <Text style={styles.detail}>Shop: {item.shop}</Text>
                    <Text style={styles.detail}>Address: {item.address}</Text>
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
});
