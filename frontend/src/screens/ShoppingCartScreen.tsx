import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useUserContext } from '../../UserContext';
import { Button } from "@rneui/themed";
import { useNavigation } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import { Ionicons } from "@expo/vector-icons";
import { WebView } from 'react-native-webview';


interface CartItem {
  quantity: number;
  product_id: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity?: number;
}

interface ShoppingCartScreenProps {
  navigation: NavigationProp<any>;
}

export default function ShoppingCartScreen(props: ShoppingCartScreenProps) {
  const { navigation } = props;
  const { user } = useUserContext();
  const [cartDisplayItems, setCartDisplayItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const cart = user?.cart || '[]'; // Provide a default value in case user.cart is false
  const [productName, setProductName] = useState("");
  const user_id = user.user_id;
  const products = [
    { id: 1, name: '자두', price: 9000, description: "자두 2kg 추희자두 국산 자두 가을자두 후무사자두" },
    { id: 2, name: '산딸기', price: 15000, description: "맛있는 산딸기"  },
    { id: 3, name: '수박', price: 18000, description: "맛있는 수박" },
    { id: 4, name: '복숭아', price: 20000, description: "맛있는 복숭아" },
    { id: 5, name: '샤인머스캣', price: 30000, description: "맛있는 샤인머스캣"  },
  ];
  console.log("user_id", user.user_id)
  useEffect(() => {
    if (user) {
      const cart = user.cart || '[]';
      console.log("haha", user);
    }
  }, [user]);

  useEffect(() => {
    let quantities = new Map<number, number>();
    let cartItems: CartItem[] = [];

    try {
      cartItems = JSON.parse(cart);
    } catch (error) {
      console.error('Error parsing cart:', error);
    }

    for (let item of cartItems) {
      let currentQuantity = quantities.get(item.product_id) || 0;
      quantities.set(item.product_id, currentQuantity + item.quantity);
    }

    let displayItems: Product[] = [];

    for (let [productId, totalQuantity] of quantities) {
      let matchingProduct = products.find((product) => product.id === productId);

      if (matchingProduct) {
        matchingProduct.quantity = totalQuantity; // Add a quantity property to the product
        displayItems.push(matchingProduct);
      }
    }

    setCartDisplayItems(displayItems);

    let calculatedTotalPrice = displayItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(calculatedTotalPrice);
    const concatenatedNames = displayItems.map((item) => item.name).join(", ");
    console.log("Concatenated product names:", concatenatedNames);

    setProductName(concatenatedNames)
    // console.log("productName", productName);
  }, [cart]);

  useEffect(() => {
    console.log("Updated productName:", productName);
  }, [productName]);


  const makeOrder = async () => {
    try {
      const response = await fetch("http://localhost:3000/make-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalPrice, user_id, productName }),
      });

      const data = await response.json();
      const responseData = data.responseData;
    
      const { url } = responseData;
      console.log(url);
      if (url) {
        // debugger;
        // setWebViewUrl(url);
        // setShowWebView(true);
        navigation.navigate('PaymentWebView', { url })
      }
    } catch (error) {
      console.error('Error making order:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:3000/cart-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      });
  
      if (response.ok) {
        // 카트 정보 삭제 성공 시, 카트 데이터를 초기화
        setCartDisplayItems([]);
        setTotalPrice(0);
      } else {
        console.error('Failed to delete cart');
      }
    } catch (error) {
      console.error('Error deleting cart:', error);
    }
  };
  
  

// const makeOrder = async () => {
//   try {
//     const url = 'https://sandbox-api.nicepay.co.kr/v1/checkout';
//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': 'Basic UzFfY2UxYmIxZWJlYmM0NGZlMWEzZjdjZWM5NzZjODNlYTc6MTNlOTY5YTc3YTA1NDU3OTkyNDJjY2MzOTE1MjQzZDM='
//     };
//     const data = {
//       "method": "all",
//       "sessionId" : "unique-sessionId-001",
//       "orderId": "order-id-unique-order-001",
//       "clientId" : "S1_ce1bb1ebebc44fe1a3f7cec976c83ea7",
//       "amount": 1004,
//       "goodsName" : "test",
//       "returnUrl": "http://localhost:3000/order",
//       "language" : "EN",
//       "fakeAuth": "true",
//     };

//     const response = await fetch(url, {
//       method: "POST",
//       headers,
//       body: JSON.stringify(data),
//     });

//     const responseData = await response.json();
//     console.log('Response:', responseData);
//   } catch (error) {
//     console.error('Error making order:', error);
//   }
// };


  return (
    <View style={styles.container}>
      <FlatList
        data={cartDisplayItems}
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.cartItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.quantity}>수량: {item.quantity}</Text>
            <Text style={styles.quantity}>개당 가격: {item.price} ₩</Text>
            <Text style={styles.price}>총 가격: {item.price * item.quantity} ₩</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalPrice}>총 가격: {totalPrice} ₩</Text>
        <Button
          title="주문하기"
          onPress={makeOrder}
        />
      </View>
      <Button
        title="홈"
        onPress={() => navigation.navigate('홈')}
        containerStyle={styles.quantityButton}
      />
      <Button
        title="모두 삭제"
        onPress={handleDelete}
        buttonStyle={{
          backgroundColor: '#CC3D3D',
        }}
        containerStyle={styles.deleteButton}
      />
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
  quantityButton: {
    borderRadius: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA000",
  },
  deleteButton: {
    borderRadius: 0,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CC3D3D",
    marginVertical: 10,
  },
});
