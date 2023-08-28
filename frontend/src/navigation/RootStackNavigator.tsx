// src/navigation/RootStackNavigator.tsx
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import PaymentWebView from '../screens/PaymentWebView';
const Stack = createStackNavigator();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignIn" screenOptions = {{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={BottomTabNavigator} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      <Stack.Screen name="ShoppingCartScreen" component={ShoppingCartScreen} />
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} />
    </Stack.Navigator>
  );
}
