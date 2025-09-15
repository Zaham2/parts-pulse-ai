import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useCart } from '../contexts/CartContext';

export default function CheckoutScreen() {
  const { items, total } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const handlePlaceOrder = () => {
    // Process order
    console.log('Order placed:', { items, total, shippingAddress });
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Order Summary */}
      <View className="bg-card rounded-lg p-4 mb-4">
        <Text className="text-card-foreground font-semibold text-lg mb-3">
          Order Summary
        </Text>
        {items.map((item) => (
          <View key={item.id} className="flex-row justify-between items-center mb-2">
            <Text className="text-card-foreground flex-1">
              {item.title} x{item.quantity}
            </Text>
            <Text className="text-card-foreground font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View className="border-t border-border pt-2 mt-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-card-foreground font-semibold text-lg">
              Total
            </Text>
            <Text className="text-primary font-bold text-xl">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Shipping Address */}
      <View className="bg-card rounded-lg p-4 mb-4">
        <Text className="text-card-foreground font-semibold text-lg mb-3">
          Shipping Address
        </Text>
        
        <TextInput
          className="bg-input rounded-lg p-3 mb-3 text-foreground"
          placeholder="Full Name"
          value={shippingAddress.fullName}
          onChangeText={(text) => setShippingAddress(prev => ({ ...prev, fullName: text }))}
          placeholderTextColor="#6B7280"
        />
        
        <TextInput
          className="bg-input rounded-lg p-3 mb-3 text-foreground"
          placeholder="Address"
          value={shippingAddress.address}
          onChangeText={(text) => setShippingAddress(prev => ({ ...prev, address: text }))}
          placeholderTextColor="#6B7280"
        />
        
        <View className="flex-row gap-3 mb-3">
          <TextInput
            className="bg-input rounded-lg p-3 flex-1 text-foreground"
            placeholder="City"
            value={shippingAddress.city}
            onChangeText={(text) => setShippingAddress(prev => ({ ...prev, city: text }))}
            placeholderTextColor="#6B7280"
          />
          <TextInput
            className="bg-input rounded-lg p-3 flex-1 text-foreground"
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChangeText={(text) => setShippingAddress(prev => ({ ...prev, postalCode: text }))}
            placeholderTextColor="#6B7280"
          />
        </View>
        
        <TextInput
          className="bg-input rounded-lg p-3 text-foreground"
          placeholder="Phone Number"
          value={shippingAddress.phone}
          onChangeText={(text) => setShippingAddress(prev => ({ ...prev, phone: text }))}
          placeholderTextColor="#6B7280"
          keyboardType="phone-pad"
        />
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        className="bg-primary rounded-lg py-4 mb-6"
        onPress={handlePlaceOrder}
      >
        <Text className="text-primary-foreground font-semibold text-center text-lg">
          Place Order - ${total.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}