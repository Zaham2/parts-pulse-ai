import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOrders } from '../../src/hooks/useOrders';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600';
    case 'shipped': return 'text-blue-600';
    case 'confirmed': return 'text-yellow-600';
    case 'pending': return 'text-orange-600';
    case 'cancelled': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

export default function OrdersScreen() {
  const navigation = useNavigation();
  const { data: orders = [], isLoading, error } = useOrders();

  const renderOrder = ({ item: order }) => (
    <TouchableOpacity className="bg-card rounded-lg p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-card-foreground font-semibold">
          Order #{order.id?.toString().slice(-6)}
        </Text>
        <Text className={`font-medium capitalize ${getStatusColor(order.status)}`}>
          {order.status}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-muted-foreground">
          {format(new Date(order.created_at), 'MMM dd, yyyy')}
        </Text>
        <Text className="text-primary font-bold">
          ${order.total_amount?.toFixed(2)}
        </Text>
      </View>
      
      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <View className="border-t border-border pt-2">
          {order.items.slice(0, 3).map((item, index) => (
            <View key={index} className="flex-row items-center mb-1">
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/40' }}
                className="w-8 h-8 rounded mr-2"
                resizeMode="cover"
              />
              <Text className="text-card-foreground text-sm flex-1">
                {item.title} x{item.quantity}
              </Text>
            </View>
          ))}
          {order.items.length > 3 && (
            <Text className="text-muted-foreground text-xs mt-1">
              +{order.items.length - 3} more items
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-6">
        <Text className="text-destructive text-center mb-4">
          Failed to load orders
        </Text>
        <Text className="text-muted-foreground text-center">
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {orders.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-muted-foreground text-xl mb-4 text-center">
            No orders yet
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            Start shopping to see your orders here!
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-lg py-3 px-6"
            onPress={() => navigation.navigate('Products')}
          >
            <Text className="text-primary-foreground font-semibold">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}