import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, Filter } from '@expo/vector-icons/Feather';

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: '1',
    title: 'RTX 4080 Graphics Card',
    price: 899,
    condition: 'like_new',
    images: ['https://via.placeholder.com/200'],
    rating: 4.5,
    reviewCount: 12,
  },
  {
    id: '2',
    title: 'Intel Core i7-13700K',
    price: 400,
    condition: 'new',
    images: ['https://via.placeholder.com/200'],
    rating: 4.8,
    reviewCount: 8,
  },
];

export default function ProductsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      className="bg-card rounded-lg p-4 mb-4 shadow-sm"
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] }}
        className="w-full h-40 rounded-lg mb-3"
        resizeMode="cover"
      />
      <Text className="text-card-foreground font-semibold text-lg mb-1">
        {item.title}
      </Text>
      <Text className="text-primary font-bold text-xl mb-2">
        ${item.price}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-muted-foreground capitalize">
          {item.condition.replace('_', ' ')}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-yellow-500 mr-1">★</Text>
          <Text className="text-muted-foreground">
            {item.rating} ({item.reviewCount})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      {/* Search Bar */}
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center bg-secondary rounded-lg px-3 py-2">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-secondary-foreground"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity className="ml-2">
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={mockProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}