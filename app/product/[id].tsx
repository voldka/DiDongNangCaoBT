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
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { productApi } from "../../api/productApi";
import { commentApi } from "../../api/commentApi";
import { cartApi } from "../../api/cartApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

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

  const fetchComments = async () => {
    if (!id) return;
    
    setLoadingComments(true);
    try {
      const commentsData = await commentApi.getCommentsByProduct(id);
      if (commentsData.status === 'success') {
        setComments(commentsData.data);
      } else {
        console.error('Failed to fetch comments:', commentsData.message);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleQuantityChange = (increment: number) => {
    const newQuantity = quantity + increment;
    if (newQuantity >= 1 && newQuantity <= product.countInStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;
    
    setAddingToCart(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const cartItem = {
        productId: product._id,
        productName: product.name,
        image: product.image[0],
        price: product.price,
        amount: quantity,
        totalPrice: product.price * quantity
      };

      await cartApi.updateCart(userId, {
        products: [cartItem]
      });
      
      alert('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };

  const submitRatingAndComment = async () => {
    if (userRating === 0) {
      Alert.alert("Rating Required", "Please select a star rating");
      return;
    }

    if (userComment.trim() === "") {
      Alert.alert("Comment Required", "Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert("Authentication Required", "Please log in to leave a review");
        return;
      }

      // Submit the new comment
      await commentApi.createComment({
        content: userComment,
        rating: userRating,
        userId,
        productId: product._id
      });

      // Update product rating
      await productApi.ratingProduct(userId, product._id, {
        star: userRating,
      });

      // Refresh product data to show updated rating
      const response = await productApi.getDetailsProduct(id);
      setProduct(response.data);
      
      // Clear input fields before showing success message
      setUserComment("");
      setUserRating(0);
      
      // Show loading indicator for comments
      setLoadingComments(true);
      
      // Fetch updated comments
      try {
        const commentsData = await commentApi.getCommentsByProduct(id);
        if (commentsData.status === 'success') {
          setComments(commentsData.data);
          
          // Short delay to ensure UI updates before showing the success message
          setTimeout(() => {
            Alert.alert(
              "Review Submitted", 
              "Thank you! Your review has been added successfully.",
              [
                { 
                  text: "OK", 
                  onPress: () => {
                    // Scroll to the comments section
                    if (comments.length > 0) {
                      const commentSection = document.getElementById('comments-section');
                      if (commentSection) {
                        commentSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  } 
                }
              ]
            );
          }, 300);
        }
      } catch (error) {
        console.error('Error refreshing comments:', error);
      } finally {
        setLoadingComments(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert("Error", "Failed to submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  const renderComment = ({ item }) => {
    // Format the date string
    const commentDate = new Date(item.createdAt);
    const formattedDate = commentDate.toLocaleDateString();
    
    return (
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.user?.name || 'Anonymous'}</Text>
          {renderStars(item.star || 0)}
          <Text style={styles.commentDate}>{formattedDate}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    );
  };

  const StarRating = () => {
    return (
      <View style={styles.ratingStarsSelector}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingChange(star)}
          >
            <Ionicons
              name={star <= userRating ? "star" : "star-outline"}
              size={32}
              color="#FFD700"
              style={styles.ratingStar}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
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

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

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

          <Text style={styles.sectionTitle} id="comments-section">Customer Reviews</Text>
          {loadingComments ? (
            <ActivityIndicator size="small" color="#000" style={styles.commentsLoading} />
          ) : Array.isArray(comments) && comments.length > 0 ? (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item._id || item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noReviews}>No reviews yet</Text>
          )}

          <View style={styles.reviewFormContainer}>
            <Text style={styles.sectionTitle}>Write a Review</Text>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <StarRating />
            
            <Text style={styles.commentLabel}>Your Comment:</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Share your thoughts about this product..."
              value={userComment}
              onChangeText={setUserComment}
            />
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                (isSubmitting || userRating === 0 || userComment.trim() === "") && styles.disabledButton
              ]}
              onPress={submitRatingAndComment}
              disabled={isSubmitting || userRating === 0 || userComment.trim() === ""}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quantitySelector}>
            <Text style={styles.sectionTitle}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity >= product.countInStock && styles.disabledButton]}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= product.countInStock}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <TouchableOpacity 
          style={[styles.addToCartButton, addingToCart && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          <Text style={styles.addToCartText}>
            {addingToCart ? 'Adding...' : `Add ${quantity} to Cart`}
          </Text>
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
  disabledButton: {
    backgroundColor: '#666',
  },
  quantitySelector: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  reviewFormContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  ratingStarsSelector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  ratingStar: {
    marginRight: 8,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  commentsLoading: {
    marginVertical: 16,
  },
});

export default ProductDetail;
