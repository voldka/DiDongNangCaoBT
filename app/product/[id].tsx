import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { productApi } from "../../api/productApi";

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
       
        const response = await productApi.getDetailsProduct(id);
       

        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

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
            source={{ uri: product.image[currentImageIndex] }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageDots}>
            {product.image.map((_, index) => (
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
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.type}>Type: {product.type.name}</Text>
          
          <View style={styles.ratingContainer}>
            {renderStars(parseFloat(product.rating.$numberDecimal))}
            <Text style={styles.reviewCount}>
              ({product.countRating} reviews)
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₫{formatPrice(product.price)}</Text>
            {product.discount > 0 && (
              <Text style={styles.discount}>{product.discount}% OFF</Text>
            )}
          </View>

          <View style={styles.stockInfo}>
            <Text>In Stock: {product.countInStock}</Text>
            <Text>Sold: {product.selled}</Text>
          </View>

          {product.attributes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Attributes</Text>
              <View style={styles.attributes}>
                {product.attributes.map((attr, index) => (
                  <View key={index} style={styles.attributeItem}>
                    <Text style={styles.attributeName}>{attr.name}: </Text>
                    <Text>{attr.value}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          {Array.isArray(product.comments) && product.comments.length > 0 ? (
            <FlatList
              data={product.comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noReviews}>No reviews yet</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  type: {
    fontSize: 16,
    color: '#666',
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
  discount: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  attributes: {
    marginBottom: 16,
  },
  attributeItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  attributeName: {
    fontWeight: '600',
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
  noReviews: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetail;
