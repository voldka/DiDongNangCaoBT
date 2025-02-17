import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - replace with real data in your app
  const product = {
    id,
    name: "Nike Air Max 2023",
    price: "$199.99",
    points: 1999,
    rating: 4.5,
    totalReviews: 128,
    description:
      "The latest Nike Air Max featuring enhanced comfort and style. Perfect for both athletic performance and casual wear.",
    images: [
      "https://via.placeholder.com/400?text=Image1",
      "https://via.placeholder.com/400?text=Image2",
      "https://via.placeholder.com/400?text=Image3",
    ],
    comments: [
      {
        id: "1",
        user: "John D.",
        rating: 5,
        text: "Great product, very comfortable!",
        date: "2023-12-01",
      },
      {
        id: "2",
        user: "Sarah M.",
        rating: 4,
        text: "Good quality but slightly expensive",
        date: "2023-11-28",
      },
    ],
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>{item.user}</Text>
        {renderStars(item.rating)}
        <Text style={styles.commentDate}>{item.date}</Text>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <>
      {/* <SafeAreaView style={styles.container}> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back and share buttons */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Image carousel */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[currentImageIndex] }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageDots}>
            {product.images.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  currentImageIndex === index && styles.activeDot,
                ]}
                onPress={() => setCurrentImageIndex(index)}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Product info */}
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(product.rating)}
            <Text style={styles.reviewCount}>
              ({product.totalReviews} reviews)
            </Text>
          </View>

          {/* Price section */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.points}>{product.points} points</Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Comments section */}
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <FlatList
            data={product.comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Bottom action button */}
      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      {/* </SafeAreaView> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    position: "absolute",
    zIndex: 1,
    width: "100%",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 400,
  },
  imageDots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  reviewCount: {
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 12,
  },
  points: {
    fontSize: 16,
    color: "#009688",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  commentItem: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: "600",
    marginRight: 8,
  },
  commentDate: {
    color: "#666",
    fontSize: 12,
    marginLeft: 8,
  },
  commentText: {
    color: "#333",
  },
  bottomButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addToCartButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetail;
