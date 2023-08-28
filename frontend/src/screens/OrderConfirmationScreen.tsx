import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface OrderConfirmationScreenProps {
  navigation: NavigationProp<any>;
}

export default function OrderConfirmationScreen(props: OrderConfirmationScreenProps) {
  const { navigation } = props;
  return (
    <View>
      <Text>주문내역 화면</Text>
    
    </View>
  );
}
