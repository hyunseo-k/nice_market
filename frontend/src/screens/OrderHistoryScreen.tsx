import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, FlatList } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useUserContext } from '../../UserContext';

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
      <View style={styles.totalContainer}>
        {/* <Text style={styles.totalPrice}>총 주문 건 수: {cartItems.length()} ₩</Text> */}
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
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
