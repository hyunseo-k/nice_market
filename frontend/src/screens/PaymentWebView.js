import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

class PaymentWebView extends React.Component {
  render() {
    const { route } = this.props;
    const { url } = route.params;
    // console.log("들어옴", url);

    return Platform.OS === "web" ? (
      <iframe src={url} height={'100%'} width={'100%'} />
    ) : (
      <View style={styles.container}>
        <WebView
          source={{ uri: url }}
          style={{ flex: 1, width: '100%' }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentWebView;
