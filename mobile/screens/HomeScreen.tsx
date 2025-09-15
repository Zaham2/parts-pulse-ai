import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Hero Section */}
        <View className="bg-card rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Parts Pulse AI
          </Text>
          <Text className="text-muted-foreground mb-4">
            Buy and sell computer components with AI-powered evaluation
          </Text>
          <TouchableOpacity 
            className="bg-primary rounded-lg py-3 px-6"
            onPress={() => navigation.navigate('Products')}
          >
            <Text className="text-primary-foreground font-semibold text-center">
              Browse Products
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View className="space-y-4">
          <TouchableOpacity 
            className="bg-secondary rounded-lg p-4 flex-row items-center"
            onPress={() => navigation.navigate('Products')}
          >
            <View className="flex-1">
              <Text className="text-secondary-foreground font-semibold text-lg mb-1">
                Shop Components
              </Text>
              <Text className="text-muted-foreground">
                Find the best deals on CPUs, GPUs, and more
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-accent rounded-lg p-4 flex-row items-center">
            <View className="flex-1">
              <Text className="text-accent-foreground font-semibold text-lg mb-1">
                AI Evaluation
              </Text>
              <Text className="text-muted-foreground">
                Get instant price estimates for your components
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-card border border-border rounded-lg p-4 flex-row items-center"
            onPress={() => navigation.navigate('Orders')}
          >
            <View className="flex-1">
              <Text className="text-card-foreground font-semibold text-lg mb-1">
                My Orders
              </Text>
              <Text className="text-muted-foreground">
                Track your purchases and sales
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}