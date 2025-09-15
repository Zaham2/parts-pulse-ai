import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ShoppingCart, Star } from '@expo/vector-icons/Feather';

// Mock data - replace with actual API calls
const mockProduct = {
  id: '1',
  title: 'RTX 4080 Graphics Card',
  description: 'High-performance graphics card perfect for gaming and content creation.',
  price: 899,
  originalPrice: 1200,
  condition: 'like_new',
  brand: 'NVIDIA',
  images: [
    'https://via.placeholder.com/400x300',
    'https://via.placeholder.com/400x300',
  ],
  rating: 4.5,
  reviewCount: 12,
  seller: {
    name: 'John Doe',
    rating: 4.8,
  },
};

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', productId);
  };

  const handleBuyNow = () => {
    navigation.navigate('Checkout', { productId });
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Product Images */}
      <View className="h-80">
        <Image
          source={{ uri: mockProduct.images[0] }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="p-4">
        {/* Product Info */}
        <Text className="text-2xl font-bold text-foreground mb-2">
          {mockProduct.title}
        </Text>
        
        <View className="flex-row items-center mb-3">
          <Text className="text-3xl font-bold text-primary mr-3">
            ${mockProduct.price}
          </Text>
          {mockProduct.originalPrice && (
            <Text className="text-lg text-muted-foreground line-through">
              ${mockProduct.originalPrice}
            </Text>
          )}
        </View>

        {/* Rating */}
        <View className="flex-row items-center mb-4">
          <View className="flex-row mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                color={i < Math.floor(mockProduct.rating) ? '#FFC107' : '#E0E0E0'}
                fill={i < Math.floor(mockProduct.rating) ? '#FFC107' : 'transparent'}
              />
            ))}
          </View>
          <Text className="text-muted-foreground">
            {mockProduct.rating} ({mockProduct.reviewCount} reviews)
          </Text>
        </View>

        {/* Condition & Brand */}
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-muted-foreground">Condition</Text>
            <Text className="text-foreground font-medium capitalize">
              {mockProduct.condition.replace('_', ' ')}
            </Text>
          </View>
          <View>
            <Text className="text-muted-foreground">Brand</Text>
            <Text className="text-foreground font-medium">
              {mockProduct.brand}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-foreground mb-6">
          {mockProduct.description}
        </Text>

        {/* Seller Info */}
        <View className="bg-secondary rounded-lg p-4 mb-6">
          <Text className="text-secondary-foreground font-medium mb-1">
            Sold by {mockProduct.seller.name}
          </Text>
          <View className="flex-row items-center">
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text className="text-muted-foreground ml-1">
              {mockProduct.seller.rating} seller rating
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-secondary rounded-lg py-4 flex-row items-center justify-center"
            onPress={handleAddToCart}
          >
            <ShoppingCart size={20} color="#374151" />
            <Text className="text-secondary-foreground font-semibold ml-2">
              Add to Cart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-primary rounded-lg py-4"
            onPress={handleBuyNow}
          >
            <Text className="text-primary-foreground font-semibold text-center">
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}