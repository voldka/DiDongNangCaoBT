import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderApi } from '../../api/orderApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';

const OrderDetail = () => {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // New state for edit mode and order modification.
  const [editMode, setEditMode] = useState(false);
  const [modifiedOrder, setModifiedOrder] = useState({
    fullName: '',
    phone: '',
    deliveryAddress: '',
    notes: ''
  });

  // Kiểm tra xem đơn hàng có thể chỉnh sửa không (deliveryStatus = "chờ xác nhận")
  const canEditOrder = order?.deliveryStatus === 'Chờ xác nhận' || 
                      order?.deliveryStatus === 'chờ xác nhận' || 
                      order?.deliveryStatus === 'Pending' || 
                      (order?.deliveryStatus && order.deliveryStatus.toLowerCase() === 'pending') ||
                      order?.deliveryStatus === t('status.pendingDelivery');
                      
  // Kiểm tra đơn hàng có hợp lệ và có đủ thông tin không
  const isValidOrder = order && 
                      order.products && 
                      Array.isArray(order.products) && 
                      order.orderStatus && 
                      order.createdAt;
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrderById(id);
        if (response.status === 'success') {
          setOrder(response.data);
          setModifiedOrder({
            fullName: response.data.fullName || '',
            phone: response.data.phone || '',
            deliveryAddress: response.data.deliveryAddress || '',
            notes: response.data.notes || ''
          });
        } else {
          setError(t('errors.fetchFailed'));
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(t('errors.networkError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, t]);

  // Handle order field changes.
  const handleChange = (field: string, value: string) => {
    setModifiedOrder({ ...modifiedOrder, [field]: value });
  };

	// Save modifications.
  const handleSave = async () => {
    if (!canEditOrder) {
      Alert.alert(t('errors.generalError'), t('orderHistory.cannotEditOrder'));
      setEditMode(false);
      return;
    }
    
    try {
      setIsSaving(true);
      const updateData = {
        fullName: modifiedOrder.fullName,
        phone: modifiedOrder.phone,
        deliveryAddress: modifiedOrder.deliveryAddress,
        notes: modifiedOrder.notes
      };
      
      // const response = await orderApi.updateOrder(id.toString(), updateData);
      const response = await orderApi.updateOrder(id, updateData);
      
      if (response.status === 'success') {
        // Cập nhật state order với thông tin mới
        setOrder({
          ...order,
          ...updateData
        });
        Alert.alert(t('status.success'), t('orderHistory.orderUpdated'));
      } else {
        Alert.alert(t('errors.generalError'), response.message || t('errors.updateFailed'));
      }
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert(t('errors.generalError'), t('errors.networkError'));
    } finally {
      setIsSaving(false);
      setEditMode(false);
    }
  };
  
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
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>{t('orderHistory.loading')}</Text>
      </View>
    );
  }
  
  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || t('orderHistory.orderNotFound')}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!isValidOrder) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('orderHistory.invalidOrderData')}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

	return (
		<ScrollView contentContainerStyle={styles.container}>
		  <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {t('orderHistory.orderDetails')} #{id.toString().slice(-6)}
        </Text>
        
        <LanguageSelector />
      </View>
      
			<View style={styles.infoSection}>
				<Text style={styles.infoItem}>{t('orderHistory.orderDate')}: {formatDate(order.createdAt)}</Text>
				<Text style={styles.infoItem}>{t('orderHistory.orderStatus')}: {order.orderStatus}</Text>
				<Text style={styles.infoItem}>{t('orderHistory.paymentMethod')}: {order.paymentMethod}</Text>
				<Text style={styles.infoItem}>{t('orderHistory.paymentStatus')}: {order.paymentStatus}</Text>
				<Text style={styles.infoItem}>{t('orderHistory.deliveryStatus')}: {order.deliveryStatus}</Text>
			</View>
			
			<View style={styles.shippingSection}>
			  <Text style={styles.sectionTitle}>{t('orderHistory.shippingDetails')}</Text>
			  {editMode ? (
          <View style={styles.editFieldsContainer}>
            <Text style={styles.fieldLabel}>{t('cart.fullName')}:</Text>
            <TextInput
              style={styles.input}
              value={modifiedOrder.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              placeholder={t('cart.fullName')}
            />
            
            <Text style={styles.fieldLabel}>{t('cart.phone')}:</Text>
            <TextInput
              style={styles.input}
              value={modifiedOrder.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder={t('cart.phone')}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.fieldLabel}>{t('cart.deliveryAddress')}:</Text>
            <TextInput
              style={styles.input}
              value={modifiedOrder.deliveryAddress}
              onChangeText={(text) => handleChange('deliveryAddress', text)}
              placeholder={t('cart.deliveryAddress')}
              multiline={true}
            />
            
            <Text style={styles.fieldLabel}>{t('cart.notes')}:</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={modifiedOrder.notes}
              onChangeText={(text) => handleChange('notes', text)}
              placeholder={t('cart.notes')}
              multiline={true}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.infoItem}>{t('cart.fullName')}: {order.fullName || modifiedOrder.fullName}</Text>
            <Text style={styles.infoItem}>{t('cart.phone')}: {order.phone || modifiedOrder.phone}</Text>
            <Text style={styles.infoItem}>{t('cart.deliveryAddress')}: {order.deliveryAddress || modifiedOrder.deliveryAddress}</Text>
            {(order.notes || modifiedOrder.notes) && (
              <Text style={styles.infoItem}>{t('cart.notes')}: {order.notes || modifiedOrder.notes}</Text>
            )}
          </View>
        )}
			</View>
			
			<Text style={styles.sectionTitle}>{t('orderHistory.products')}</Text>
			<View style={styles.productsContainer}>
				{order.products.map((product, index) => (
					<View key={product._id || index} style={styles.productItem}>
						<Text style={styles.productName}>{product.productName}</Text>
						<Text style={styles.productInfo}>
              {t('products.price')}: {product.price}đ × {t('products.quantity')}: {product.amount} = {product.totalPrice}đ
            </Text>
					</View>
				))}
			</View>
			
			<View style={styles.totalContainer}>
			  <Text style={styles.totalLabel}>{t('cart.total')}:</Text>
			  <Text style={styles.totalAmount}>{order.totalBill}đ</Text>
			</View>
      
      {/* Button controls for modification - Chỉ hiển thị nút chỉnh sửa khi đơn hàng có trạng thái "chờ xác nhận" */}
      {/* {canEditOrder && (
        <View style={styles.buttonContainer}>
          {editMode ? (
            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.actionButton, isSaving && styles.disabledButton]}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>{t('common.save')}</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditMode(true)} style={styles.actionButton}>
              <Text style={styles.buttonText}>{t('common.edit')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )} */}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  shippingSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },
  editFieldsContainer: {
    marginTop: 8,
  },
  infoItem: {
    marginBottom: 8,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  productItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  productName: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
  },
  productInfo: {
    color: '#666',
    fontSize: 13,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e53935',
  },
  buttonContainer: {
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginVertical: 6,
    marginBottom: 12,
    padding: 10,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
  },
});

export default OrderDetail;
