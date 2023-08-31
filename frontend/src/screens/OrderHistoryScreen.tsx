import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useUserContext } from '../../UserContext';
import { Button } from "@rneui/themed";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './HomeScreen';

interface OrderHistoryScreenProps {
  navigation: NavigationProp<any>;
}

interface Order {
  product_name: string;
  amount: number;
  order_time: string;
}

export default function OrderHistoryScreen(props: OrderHistoryScreenProps) {
  const { navigation } = props;
  const { user } = useUserContext();
  const [cartDisplayItems, setCartDisplayItems] = useState<Order[]>([]);
  const user_order = user?.user_order

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      // 여기서 필요한 작업 수행 (예: 사용자 정보 초기화)
      navigation.navigate('SignIn'); // 로그인 화면으로 이동
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    let cartItems: Order[] = [];

    try {
      // cartItems = JSON.parse(user_order);
      cartItems = user_order;
      console.log("cart_items", cartItems);
    } catch (error) {
      console.error('Error parsing cart:', error);
    }

    setCartDisplayItems(cartItems);
  }, [user_order]);

  return (
    <View style={styles.container}>
      <FlatList
        data={cartDisplayItems}
        renderItem={({ item }: { item: Order }) => (
          <View style={styles.cartItem}>
            <Text style={styles.productName}>{item.product_name}</Text>
            <Text style={styles.quantity}>결제 가격: {item.amount}</Text>
            <Text style={styles.price}>주문 시간: {item.order_time} </Text>
          </View>
        )}
        // keyExtractor={(item) => item.id.toString()}
      />
      <Button
        title="홈"
        onPress={() => navigation.navigate('홈')}
        containerStyle={styles.quantityButton}
      />
      <Button
        title="로그아웃"
        onPress={handleLogout}
        containerStyle={styles.logoutButton}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalPrice}>총 주문 건 수: {cartDisplayItems.length} 개</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  cartItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 16,
    color: '#555',
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  quantityButton: {
    borderRadius: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA000",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
});
