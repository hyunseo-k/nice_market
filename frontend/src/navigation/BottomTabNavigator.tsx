// src/navigation/BottomTabNavigator.tsx
import * as React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home"  screenOptions = {{ headerShown: false }}>
      <Tab.Screen name="홈" component={HomeScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}/>
      <Tab.Screen name="장바구니" component={ShoppingCartScreen}  options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        })}
        />
      <Tab.Screen name="주문 내역" component={OrderHistoryScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}/>
    </Tab.Navigator>
  );
}
