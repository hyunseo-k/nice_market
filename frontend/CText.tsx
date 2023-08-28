import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

type CustomTextProps = TextProps & {
  children: React.ReactNode;
};

const CText = (props: CustomTextProps) => (
  <Text style={[styles.defaultFont, props.style]} {...props}>
    {props.children}
  </Text>
);

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Jalnan',
  },
});

export default CText;
