import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const OrderDetail = () => {
	// ...existing code...
	const { id } = useLocalSearchParams();
	const router = useRouter();
  
  // New state for edit mode and order modification.
  const [editMode, setEditMode] = useState(false);
  const [modifiedOrder, setModifiedOrder] = useState({
    shop: 'Shop Name',
    address: '123 Main St, City'
  });
  
	// Dummy order data; replace with actual fetch logic.
	const order = {
		date: '2023-10-01',
		time: '14:30',
		shop: modifiedOrder.shop,
		address: modifiedOrder.address,
		items: [
			{ id: 1, name: 'Product 1', price: 10, rating: 0 },
			{ id: 2, name: 'Product 2', price: 20, rating: 0 },
		],
		total: 30,
	};

	// Function to handle product rating.
	const handleRating = (itemId: number, rating: number) => {
		// ...existing code: update rating on the backend...
		console.log(`Rated item ${itemId} with ${rating} stars`);
	};

  // Handle order field changes.
  const handleChange = (field: string, value: string) => {
    setModifiedOrder({ ...modifiedOrder, [field]: value });
  };

	// Save modifications.
  const handleSave = () => {
    // ...existing code: update order details in backend...
    setEditMode(false);
    console.log('Order modified:', modifiedOrder);
  };

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Order Details for Order #{id}</Text>
			<View style={{ marginBottom: 8 }}>
				<Text>Date: {order.date}</Text>
				<Text>Time: {order.time}</Text>
				{editMode ? (
          <>
            <TextInput
              style={{ borderWidth: 1, marginVertical: 4, padding: 4 }}
              value={modifiedOrder.shop}
              onChangeText={(text) => handleChange('shop', text)}
            />
            <TextInput
              style={{ borderWidth: 1, marginVertical: 4, padding: 4 }}
              value={modifiedOrder.address}
              onChangeText={(text) => handleChange('address', text)}
            />
          </>
        ) : (
          <>
            <Text>Shop: {order.shop}</Text>
            <Text>Address: {order.address}</Text>
          </>
        )}
			</View>
			<View style={{ marginBottom: 16 }}>
				{order.items.map(item => (
					<View key={item.id} style={{ marginBottom: 12 }}>
						<Text>{item.name} - ${item.price}</Text>
						<View style={{ flexDirection: 'row', marginTop: 4 }}>
							{[1,2,3,4,5].map(star => (
								<TouchableOpacity key={star} onPress={() => handleRating(item.id, star)} style={{ marginRight: 4 }}>
									<Text>{star}★</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				))}
			</View>
			<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total: ${order.total}</Text>
      
      {/* Button controls for modification */}
      <View style={{ marginTop: 16 }}>
        {editMode ? (
          <TouchableOpacity onPress={handleSave} style={{ backgroundColor: '#000', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Save Order</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditMode(true)} style={{ backgroundColor: '#000', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Modify Order</Text>
          </TouchableOpacity>
        )}
      </View>
		</ScrollView>
	);
};

export default OrderDetail;
