import React from 'react';
// import { Provider } from 'react-redux';
// import store from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from './src/navigation/RootStackNavigator';
import { StyleSheet } from 'react-native'; // StyleSheet를 임포트합니다.
import CText from "./CText"
import { ThemeProvider, Button, createTheme } from '@rneui/themed';
import { UserProvider } from './UserContext';

const theme = createTheme({
  lightColors: {
    primary: '#FFA000'
  },
  // And set that mode as default
  mode: 'light',
  components: {
    Button: {
      radius: "10",
      style: {
        width: 200,
        marginVertical: 5,
      },
    },
  },
});



export default function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </UserProvider>
    
    
  );
}


