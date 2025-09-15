import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ShoppingCart, Star } from '@expo/vector-icons/Feather';
import { useProducts } from '../../src/hooks/useProducts';
import { useCart } from '../contexts/CartContext';

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const { data: products = [] } = useProducts();
  const { addToCart } = useCart();

  const product = React.useMemo(() => {
    return products.find(p => p.id.toString() === productId.toString());
  }, [products, productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      Alert.alert('Success', 'Product added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigation.navigate('Checkout');
    }
  };

  if (!product) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Product Images */}
      <View className="h-80">
        <Image
          source={{ uri: product.images?.[0] || 'https://via.placeholder.com/400x300' }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="p-4">
        {/* Product Info */}
        <Text className="text-2xl font-bold text-foreground mb-2">
          {product.title}
        </Text>
        
        <View className="flex-row items-center mb-3">
          <Text className="text-3xl font-bold text-primary mr-3">
            ${product.price}
          </Text>
          {product.originalPrice && (
            <Text className="text-lg text-muted-foreground line-through">
              ${product.originalPrice}
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
                color={i < Math.floor(product.rating || 0) ? '#FFC107' : '#E0E0E0'}
                fill={i < Math.floor(product.rating || 0) ? '#FFC107' : 'transparent'}
              />
            ))}
          </View>
          <Text className="text-muted-foreground">
            {product.rating || 0} ({product.reviewCount || 0} reviews)
          </Text>
        </View>

        {/* Condition & Category */}
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-muted-foreground">Condition</Text>
            <Text className="text-foreground font-medium capitalize">
              {product.condition?.replace('_', ' ') || 'New'}
            </Text>
          </View>
          <View>
            <Text className="text-muted-foreground">Category</Text>
            <Text className="text-foreground font-medium">
              {product.category || 'Electronics'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-foreground mb-6">
          {product.description || 'No description available.'}
        </Text>

        {/* Seller Info */}
        <View className="bg-secondary rounded-lg p-4 mb-6">
          <Text className="text-secondary-foreground font-medium mb-1">
            Sold by {product.seller_name || 'Store'}
          </Text>
          <View className="flex-row items-center">
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text className="text-muted-foreground ml-1">
              4.8 seller rating
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