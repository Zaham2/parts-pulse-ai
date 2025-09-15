import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, Filter } from '@expo/vector-icons/Feather';
import { useProducts } from '../../src/hooks/useProducts';

export default function ProductsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: products = [], isLoading } = useProducts();

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      className="bg-card rounded-lg p-4 mb-4 shadow-sm"
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/200' }}
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
          {item.condition?.replace('_', ' ') || 'New'}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-yellow-500 mr-1">★</Text>
          <Text className="text-muted-foreground">
            {item.rating || 0} ({item.reviewCount || 0})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Loading products...</Text>
      </View>
    );
  }

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
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-muted-foreground text-center">
              {searchQuery ? 'No products found matching your search.' : 'No products available.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}