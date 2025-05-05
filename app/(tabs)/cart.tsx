import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Image, ActivityIndicator, FlatList, Text, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, List, InputItem, TextareaItem } from '@ant-design/react-native';
import { cartApi } from '../../api/cartApi';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orderApi } from '../../api/orderApi';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

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
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '',
    deliveryAddress: '',
    notes: '',
  });
  const router = useRouter();
  const { t } = useTranslation();

  const fetchCartItems = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCartByUserId(userId);
      setCartItems(response.data?.products || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  const fetchUserData = useCallback(async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userInfo = JSON.parse(userDataStr);
        setUserData(userInfo);
        setCheckoutForm({
          fullName: userInfo.name || '',
          phone: userInfo.phone || '',
          deliveryAddress: userInfo.address || '',
          notes: '',
        });
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
      Alert.alert(t('errors.generalError'), t('errors.networkError'));
    }
  }, [cartItems, userId, t]);

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
      Alert.alert(t('errors.generalError'), t('errors.networkError'));
    }
  }, [cartItems, userId, handleRemoveItem, t]);

  const handleCancelOrder = useCallback(() => {
    Alert.alert(t('cart.cancelOrder'), t('cart.confirmCancel'), [
      { text: t('common.cancel'), style: 'cancel' },
      { 
        text: t('common.save'), 
        onPress: async () => {
          try {
            const products = cartItems.map(item => ({
              productId: item.productId,
              amount: 0
            }));
            
            await cartApi.updateCart(userId, { products });
            setCartItems([]);
          } catch (error) {
            Alert.alert(t('errors.generalError'), t('errors.networkError'));
          }
        } 
      }
    ]);
  }, [cartItems, userId, t]);

  const openCheckoutModal = () => {
    if (!userId || cartItems.length === 0) {
      Alert.alert(t('errors.generalError'), t('cart.emptyCart'));
      return;
    }
    setCheckoutModalVisible(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setCheckoutForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = useCallback(async () => {
    try {
      if (!userId || cartItems.length === 0) {
        Alert.alert(t('errors.generalError'), t('cart.emptyCart'));
        return;
      }
      
      // Validate form fields
      if (!checkoutForm.fullName.trim()) {
        Alert.alert(t('errors.invalidInput'), t('errors.requiredField') + ': ' + t('cart.fullName'));
        return;
      }
      
      if (!checkoutForm.phone.trim()) {
        Alert.alert(t('errors.invalidInput'), t('errors.requiredField') + ': ' + t('cart.phone'));
        return;
      }
      
      if (!checkoutForm.deliveryAddress.trim()) {
        Alert.alert(t('errors.invalidInput'), t('errors.requiredField') + ': ' + t('cart.deliveryAddress'));
        return;
      }
      
      setCheckoutLoading(true);
      
      const paymentMethod = PaymentMethods.CASH;
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
        notes: checkoutForm.notes,
        fullName: checkoutForm.fullName,
        phone: checkoutForm.phone,
        deliveryAddress: checkoutForm.deliveryAddress,
        products: cartItems.map(product => {
          const { _id, ...rest } = product;
          return rest;
        }),
      };
      
      await orderApi.createOrder(payload);
      await cartApi.updateCart(userId, { products: [] });
      setCartItems([]);
      setCheckoutModalVisible(false);
      
      Alert.alert(t('status.success'), t('cart.orderSuccess'), [
        { 
          text: 'OK', 
          onPress: () => {
            router.push('/(tabs)');
          }
        }
      ]);
      
    } catch (error: any) {
      Alert.alert(t('errors.generalError'), error?.message || t('errors.networkError'));
    } finally {
      setCheckoutLoading(false);
    }
  }, [cartItems, userId, checkoutForm, router, t]);

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
          <Text>{t('products.price')}: ${item.price}</Text>
          <Text style={styles.totalPrice}>{t('cart.total')}: ${item.totalPrice}</Text>
        </View>
        <Button type="warning" size="small" onPress={() => handleRemoveItem(item._id)}>
          {t('cart.remove')}
        </Button>
      </View>
    </List.Item>
  ), [handleRemoveItem, handleUpdateAmount, t]);

  const renderCheckoutModal = () => {
    const totalOrderPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return (
      <Modal
        visible={checkoutModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('cart.completeOrder')}</Text>
                <Button
                  type="ghost"
                  size="small"
                  onPress={() => setCheckoutModalVisible(false)}
                >
                  {t('common.cancel')}
                </Button>
              </View>
              
              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>{t('cart.orderSummary')}</Text>
                <View style={styles.summaryRow}>
                  <Text>{t('cart.numberOfItems')}:</Text>
                  <Text>{cartItems.length}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>{t('cart.totalAmount')}:</Text>
                  <Text style={styles.totalAmount}>${totalOrderPrice.toFixed(2)}</Text>
                </View>
              </View>
              
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{t('cart.shippingInfo')}</Text>
                
                <InputItem
                  clear
                  placeholder={t('cart.fullName')}
                  value={checkoutForm.fullName}
                  onChange={value => handleFormChange('fullName', value)}
                />
                
                <InputItem
                  clear
                  placeholder={t('cart.phone')}
                  type="number"
                  value={checkoutForm.phone}
                  onChange={value => handleFormChange('phone', value)}
                />
                
                <InputItem
                  clear
                  placeholder={t('cart.deliveryAddress')}
                  value={checkoutForm.deliveryAddress}
                  onChange={value => handleFormChange('deliveryAddress', value)}
                />
                
                <TextareaItem
                  rows={4}
                  placeholder={t('cart.notes')}
                  count={100}
                  value={checkoutForm.notes}
                  onChange={value => handleFormChange('notes', value)}
                />
              </View>
              
              <View style={styles.checkoutButtonContainer}>
                <Button 
                  type="primary" 
                  style={styles.checkoutButton} 
                  loading={checkoutLoading}
                  onPress={handleCheckout}
                >
                  {checkoutLoading ? t('cart.processing') : t('cart.placeOrder')}
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  };

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
          <Text style={styles.emptyCart}>{t('cart.emptyCart')}</Text>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item._id}
            ListHeaderComponent={<List.Item>{t('cart.yourCart')}</List.Item>}
          />
        )}
      </View>
      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <List>
            <List.Item extra={`$${totalOrderPrice}`}>{t('cart.orderTotal')}</List.Item>
          </List>
          <Button type="warning" style={styles.button} onPress={handleCancelOrder}>
            {t('cart.cancelOrder')}
          </Button>
          <Button 
            type="primary" 
            style={styles.button} 
            onPress={openCheckoutModal}
          >
            {t('common.checkout')}
          </Button>
        </View>
      )}
      {renderCheckoutModal()}
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f9',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderSummary: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  checkoutButtonContainer: {
    padding: 16,
  },
  checkoutButton: {
    height: 45,
  },
});

export default CartScreen;
