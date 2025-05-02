import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Image, ActivityIndicator, FlatList, Text } from 'react-native';
import { Button, List } from '@ant-design/react-native';
import { cartApi } from '../../api/cartApi';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orderApi } from '../../api/orderApi';
import { useRouter } from 'expo-router';

// Updated enums to match MongoDB schema requirements
export const PaymentMethods = {
  CASH: 'thanh toán khi nhận hàng',
  CREDIT: 'Thanh toán qua thẻ',
  STORE: 'thanh toán tại của hàng',
};

export const PaymentStatus = {
  NOT_YET_PAY: 'chưa thanh toán',
  PAID: 'đã thanh toán',
  REFUNDED: 'đã hoàn tiền',
};

export const DeliveryStatus = {
  PENDING: 'chờ xác nhận',
  SHIPPING: 'đang giao hàng',
  DELIVERED: 'đã giao hàng',
  FAILED: 'giao hàng thất bại',
};

export const OrderStatus = {
  SUCCESS: 'thành công',
  CANCELLED: 'đã huỷ',
  PROCESSING: 'đang xử lý',
  PENDING: 'chờ xác nhận',
};

type CartItem = {
  _id: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  amount: number;
  totalPrice: number;
};

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  const fetchCartItems = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCartByUserId(userId);
      setCartItems(response.data?.products || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserData = useCallback(async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUserId = async () => {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
      };
      fetchUserId();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchCartItems();
      }
    }, [userId, fetchCartItems])
  );

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleRemoveItem = useCallback(async (itemId: string) => {
    try {
      const itemToUpdate = cartItems.find(item => item._id === itemId);
      if (itemToUpdate) {
        await cartApi.updateCart(userId, {
          products: [{
            productId: itemToUpdate.productId,
            amount: 0
          }]
        });
      }
      const updatedItems = cartItems.filter(item => item._id !== itemId);
      setCartItems(updatedItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  }, [cartItems, userId]);

  const handleUpdateAmount = useCallback(async (itemId: string, amountChange: number) => {
    try {
      const itemToUpdate = cartItems.find(item => item._id === itemId);
      if (itemToUpdate) {
        const newAmount = itemToUpdate.amount + amountChange;
        if (newAmount <= 0) {
          return handleRemoveItem(itemId);
        }
        
        await cartApi.updateCart(userId, {
          products: [{
            productId: itemToUpdate.productId,
            amount: amountChange
          }]
        });
        
        const updatedItems = cartItems.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              amount: newAmount,
              totalPrice: item.price * newAmount
            };
          }
          return item;
        });
        setCartItems(updatedItems);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update amount');
    }
  }, [cartItems, userId, handleRemoveItem]);

  const handleCancelOrder = useCallback(() => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel the order?', [
      { text: 'No', style: 'cancel' },
      { 
        text: 'Yes', 
        onPress: async () => {
          try {
            const products = cartItems.map(item => ({
              productId: item.productId,
              amount: 0
            }));
            
            await cartApi.updateCart(userId, { products });
            setCartItems([]);
          } catch (error) {
            Alert.alert('Error', 'Failed to cancel order');
          }
        } 
      }
    ]);
  }, [cartItems, userId]);

  const handleCheckout = useCallback(async (formValues: any = {}) => {
    try {
      if (!userId || cartItems.length === 0) {
        Alert.alert('Error', 'Your cart is empty or you are not logged in');
        return;
      }
      
      setCheckoutLoading(true);
      
      const paymentMethod = formValues.paymentMethod || PaymentMethods.CASH;
      const totalBill = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      const payload = {
        userId: userId,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === PaymentMethods.CREDIT
          ? PaymentStatus.PAID
          : PaymentStatus.NOT_YET_PAY,
        deliveryStatus: DeliveryStatus.PENDING,
        orderStatus: OrderStatus.PROCESSING,
        totalBill: totalBill,
        notes: formValues.notes || '',
        fullName: (formValues.fullName?.trim() || userData?.name?.trim() || ''),
        phone: formValues.phone || userData?.phone || '',
        deliveryAddress: (formValues.deliveryAddress?.trim() || userData?.address?.trim() || ''),
        products: cartItems.map(product => {
          const { _id, ...rest } = product;
          return rest;
        }),
      };
      
      await orderApi.createOrder(payload);
      await cartApi.updateCart(userId, { products: [] });
      setCartItems([]);
      
      Alert.alert('Success', 'Your order has been placed successfully', [
        { 
          text: 'OK', 
          onPress: () => {
            if (userData) {
              router.push('/(tabs)/cart');
            } else {
              router.push('/(tabs)');
            }
          }
        }
      ]);
      
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  }, [cartItems, userId, userData, router]);

  const renderCartItem = useCallback(({ item }: { item: CartItem }) => (
    <List.Item>
      <View style={styles.itemRow}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <View style={styles.amountContainer}>
            <Button
              type="ghost"
              size="small"
              onPress={() => handleUpdateAmount(item._id, -1)}
            >
              -
            </Button>
            <Text style={styles.amountText}>{item.amount}</Text>
            <Button
              type="ghost"
              size="small"
              onPress={() => handleUpdateAmount(item._id, 1)}
            >
              +
            </Button>
          </View>
          <Text>Price: ${item.price}</Text>
          <Text style={styles.totalPrice}>Total: ${item.totalPrice}</Text>
        </View>
        <Button type="warning" size="small" onPress={() => handleRemoveItem(item._id)}>
          Remove
        </Button>
      </View>
    </List.Item>
  ), [handleRemoveItem, handleUpdateAmount]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalOrderPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item._id}
            ListHeaderComponent={<List.Item>Your Cart</List.Item>}
          />
        )}
      </View>
      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <List>
            <List.Item extra={`$${totalOrderPrice}`}>Order Total</List.Item>
          </List>
          <Button type="warning" style={styles.button} onPress={handleCancelOrder}>
            Cancel Order
          </Button>
          <Button 
            type="primary" 
            style={styles.button} 
            loading={checkoutLoading}
            onPress={() => handleCheckout()}
          >
            {checkoutLoading ? 'Processing...' : 'Checkout'}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f9' 
  },
  content: { 
    flex: 1, 
    paddingBottom: 120 
  },
  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12 
  },
  productImage: { 
    width: 50, 
    height: 50, 
    marginRight: 12, 
    borderRadius: 4 
  },
  itemInfo: { 
    flex: 1 
  },
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
  button: { 
    marginVertical: 8 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyCart: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#757575',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  amountText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
});

export default CartScreen;
