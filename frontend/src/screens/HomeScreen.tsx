import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import CText from "../../CText"
import { Button } from "@rneui/themed";
import { useNavigation } from '@react-navigation/native';
import ProductDetailScreen from './ProductDetailScreen';
import Logo from "../../assets/Logo.png"
import image1 from "../../assets/1.png";
import image2 from "../../assets/2.png";
import image3 from "../../assets/3.png";
import image4 from "../../assets/4.png";
import image5 from "../../assets/5.png";


const navigation = useNavigation

interface Product {
  id: number;
  name: string;
  price: number,
  description: string,
}

const images = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
};


interface HomeScreenProps {
  navigation: NavigationProp<any>;
}
const products = [
  { id: 1, name: '자두', price: 9000, description: "자두 2kg 추희자두 국산 자두 가을자두 후무사자두" },
  { id: 2, name: '산딸기', price: 15000, description: "맛있는 산딸기"  },
  { id: 3, name: '수박', price: 18000, description: "맛있는 수박" },
  { id: 4, name: '복숭아', price: 20000, description: "맛있는 복숭아" },
  { id: 5, name: '샤인머스캣', price: 30000, description: "맛있는 샤인머스캣"  },
];

export default function HomeScreen(props: HomeScreenProps) {
  const { navigation } = props;
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    console.log("dd", cart);
  };

  return (
    <View>
      {products.map((product) => (
        <View key={product.id} style={styles.productContainer}>
          <Image source={images[product.id]} style={styles.productImage} />
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.spacer} /> 
          <View style={styles.priceContainer}>
            <Text style={styles.won}>{product.price} ₩</Text>
            <Button
              title="상세 보기"
              onPress={() => navigation.navigate('ProductDetailScreen', { product })}
              containerStyle={{
                width: 200,
                marginVertical: 10,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );

  
}

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  spacer: {
    flex: 1, // Occupy all available space
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  won: {
    marginEnd: 10,
    fontWeight: "bold",
  }
});