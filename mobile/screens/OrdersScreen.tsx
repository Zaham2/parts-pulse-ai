import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

// Mock orders data
const mockOrders = [
  {
    id: '1',
    status: 'delivered',
    total: 899,
    date: '2024-01-15',
    items: [
      { title: 'RTX 4080 Graphics Card', quantity: 1, price: 899 }
    ]
  },
  {
    id: '2',
    status: 'shipped',
    total: 400,
    date: '2024-01-20',
    items: [
      { title: 'Intel Core i7-13700K', quantity: 1, price: 400 }
    ]
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'text-green-600';
    case 'shipped': return 'text-blue-600';
    case 'confirmed': return 'text-yellow-600';
    case 'pending': return 'text-orange-600';
    case 'cancelled': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

export default function OrdersScreen() {
  const renderOrder = ({ item }) => (
    <TouchableOpacity className="bg-card rounded-lg p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-card-foreground font-semibold">
          Order #{item.id}
        </Text>
        <Text className={`font-medium capitalize ${getStatusColor(item.status)}`}>
          {item.status}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-muted-foreground">
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text className="text-primary font-bold">
          ${item.total}
        </Text>
      </View>
      
      <View className="border-t border-border pt-2">
        {item.items.map((orderItem, index) => (
          <Text key={index} className="text-card-foreground text-sm">
            {orderItem.title} x{orderItem.quantity}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      {mockOrders.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-muted-foreground text-center">
            No orders yet. Start shopping to see your orders here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={mockOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}