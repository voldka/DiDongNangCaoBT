import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const DetailOrder = ({ route }) => {
  // Assuming order details are passed via route.params
  const { date, time, shop, address, items, total } = route.params;

  const [ratedItems, setRatedItems] = useState({});

  const rateProduct = (id) => {
    // For demo purposes, we use a fixed rating value.
    const rating = 5;
    setRatedItems(prev => ({ ...prev, [id]: rating }));
    Alert.alert(`Rated product ${id}`, `You rated ${rating} star(s)`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => rateProduct(item.id)}>
      <Text>{item.name} - ${item.price}</Text>
      {ratedItems[item.id] && (
        <Text style={styles.rating}>Rated: {ratedItems[item.id]} star(s)</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}></View>
      <Text style={styles.header}>Order Details</Text>
      <Text>Date: {date}</Text>
      <Text>Time: {time}</Text>
      <Text>Shop: {shop}</Text>
      <Text>Address: {address}</Text>
      <Text style={styles.subHeader}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Text style={styles.total}>Total: ${total}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // ...existing code...
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  subHeader: {
    fontSize: 20,
    marginVertical: 8,
  },
  itemContainer: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    marginVertical: 4,
    borderRadius: 5,
    // ...existing code...
  },
  rating: {
    marginTop: 4,
    color: 'green',
  },
  total: {
    fontSize: 20,