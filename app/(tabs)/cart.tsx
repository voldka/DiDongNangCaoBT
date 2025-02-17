import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Image } from 'react-native';
import { Button, Card, List, WhiteSpace } from '@ant-design/react-native';

type CartItem = {
  id: string;
  name: string;
  amount: number;
  price: number;
  image: string;
};

const initialCartItems: CartItem[] = [
  { id: '1', name: 'Product A', amount: 2, price: 15, image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Product B', amount: 1, price: 30, image: 'https://via.placeholder.com/150' },
];

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel the order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => setCartItems([]) }
    ]);
  };

  const handlePayment = () => {
    Alert.alert('Payment', 'Proceeding to payment');
  };

  const totalOrderPrice = cartItems.reduce((sum, item) => sum + item.amount * item.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <List renderHeader="Your Cart">
          {cartItems.map(item => (
            <List.Item key={item.id}>
              <Card style={styles.card}>
                <Card.Header title={item.name} />
                <Card.Body>
                  <View style={styles.itemRow}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <View style={styles.itemInfo}>
                      <List.Item.Brief>Amount: {item.amount}</List.Item.Brief>
                      <List.Item.Brief>Price: ${item.price}</List.Item.Brief>
                      <List.Item.Brief>Total: ${item.amount * item.price}</List.Item.Brief>
                    </View>
                    <Button type="warning" size="small" onPress={() => handleRemoveItem(item.id)}>
                      Remove
                    </Button>
                  </View>
                </Card.Body>
              </Card>
            </List.Item>
          ))}
        </List>
      </View>
      <View style={styles.summaryContainer}>
        <List>
          <List.Item extra={`$${totalOrderPrice}`}>Order Total</List.Item>
        </List>
        <WhiteSpace size="lg" />
        <Button type="warning" style={styles.button} onPress={handleCancelOrder}>
          Cancel Order
        </Button>
        <WhiteSpace />
        <Button type="primary" style={styles.button} onPress={handlePayment}>
          Proceed to Payment
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f9' },
  content: { flex: 1, paddingBottom: 120 }, // padding to prevent overlap with fixed summary
  card: { marginVertical: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productImage: { width: 50, height: 50, marginRight: 12, borderRadius: 4 },
  itemInfo: { flex: 1 },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  button: { marginVertical: 8 },
});

export default CartScreen;
