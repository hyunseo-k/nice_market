import React, { useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from "@rneui/themed";
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../UserContext';
import ShoppingCartScreen from './ShoppingCartScreen';

import image1 from "../../assets/1.png";
import image2 from "../../assets/2.png";
import image3 from "../../assets/3.png";
import image4 from "../../assets/4.png";
import image5 from "../../assets/5.png";

const navigation = useNavigation

const images = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
};

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface ProductDetailScreenProps {
  route: RouteProp<{ ProductDetail: { product: Product } }, 'ProductDetail'>;
}

const ProductDetailScreen = ({ route }: ProductDetailScreenProps) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();
  const { user } = useUserContext();
  const { setUser: setUserContext } = useUserContext();


  const addToCart = async () => {
    try {
      // console.log("user", user)
      const response = await fetch(`http://34.64.33.83:3000/${user.user_id}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });
      console.log("product_id", product.id);
      console.log("quantity", quantity);

      const data = await response.json();
      console.log("data", data);
      if (response.ok) {
        // 카트 정보 업데이트 성공
        setUserContext(data.user);
        navigation.navigate('ShoppingCartScreen')
        console.log('카트 정보 업데이트 성공');
      } else {
        // 카트 정보 업데이트 실패
        console.log('카트 정보 업데이트 실패');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={images[product.id]} style={styles.productImage} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>가격: {product.price} ₩</Text>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.quantityContainer}>
        <Button
          title="-"
          onPress={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          containerStyle={styles.quantityButton}
          titleStyle={styles.buttonText}
        />
        <Text style={styles.quantityText}>{quantity}</Text>
        <Button
          title="+"
          onPress={() => setQuantity(quantity + 1)}
          containerStyle={styles.quantityButton}
          titleStyle={styles.buttonText}
        />
      </View>
      <Button
        title="장바구니에 추가"
        onPress={addToCart}
        containerStyle={styles.addButtonContainer}
        titleStyle={styles.buttonText}
      />
      <Button
        title="뒤로 가기"
        onPress={() => navigation.goBack()}
        containerStyle={styles.goBackButtonContainer}
        titleStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  productImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityButton: {
    borderRadius: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA000",
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 20,
  },
  addButtonContainer: {
    marginBottom: 10,
  },
  goBackButtonContainer: {
    borderColor: '#FFA000',
  },
  buttonText: {
    color: 'white',
  },
});

export default ProductDetailScreen;
