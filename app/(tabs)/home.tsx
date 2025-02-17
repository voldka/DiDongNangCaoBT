import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Mock Data
const categories = [
  { id: 1, name: "Điện tử", icon: "laptop-outline" },
  { id: 2, name: "Thời trang", icon: "shirt-outline" },
  { id: 3, name: "Nhà cửa", icon: "home-outline" },
  { id: 4, name: "Thể thao", icon: "football-outline" },
];

const products = [
  {
    id: 1,
    name: "Tai nghe không dây",
    price: 99.99,
    image: "https://picsum.photos/200",
    category: "Điện tử",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://picsum.photos/201",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 79.99,
    image: "https://picsum.photos/202",
    category: "Sports",
  },
  {
    id: 4,
    name: "Cotton T-Shirt",
    price: 29.99,
    image: "https://picsum.photos/203",
    category: "Fashion",
  },
  {
    id: 5,
    name: "Tai nghe không dây",
    price: 99.99,
    image: "https://picsum.photos/200",
    category: "Điện tử",
  },
  {
    id: 6,
    name: "Smart Watch",
    price: 199.99,
    image: "https://picsum.photos/201",
    category: "Electronics",
  },
  {
    id: 7,
    name: "Running Shoes",
    price: 79.99,
    image: "https://picsum.photos/202",
    category: "Sports",
  },
  {
    id: 8,
    name: "Cotton T-Shirt",
    price: 29.99,
    image: "https://picsum.photos/203",
    category: "Fashion",
  },
  {
    id: 9,
    name: "Running Shoes",
    price: 79.99,
    image: "https://picsum.photos/202",
    category: "Sports",
  },
  {
    id: 10,
    name: "Cotton T-Shirt",
    price: 29.99,
    image: "https://picsum.photos/203",
    category: "Fashion",
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Ionicons name={item.icon} size={24} color="#3B525F" />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#3B525F" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={24} color="#3B525F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
        </View>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
        />

        {/* Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm phổ biến</Text>
        </View>
        <FlatList
          numColumns={2}
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B525F",
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 24,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    width: 100,
  },
  categoryText: {
    marginTop: 8,
    color: "#3B525F",
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 14,
    color: "#3B525F",
    marginTop: 4,
  },
});
