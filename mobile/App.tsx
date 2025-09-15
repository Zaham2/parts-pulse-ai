import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './contexts/CartContext';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrdersScreen from './screens/OrdersScreen';
import './global.css';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Parts Pulse AI' }}
              />
              <Stack.Screen 
                name="Products" 
                component={ProductsScreen} 
                options={{ title: 'Products' }}
              />
              <Stack.Screen 
                name="ProductDetail" 
                component={ProductDetailScreen} 
                options={{ title: 'Product Details' }}
              />
              <Stack.Screen 
                name="Checkout" 
                component={CheckoutScreen} 
                options={{ title: 'Checkout' }}
              />
              <Stack.Screen 
                name="Orders" 
                component={OrdersScreen} 
                options={{ title: 'My Orders' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}