import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
} from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { Button } from "@rneui/themed";
import Logo from "../../assets/Logo.png"

interface SignUpScreenProps {
  navigation: NavigationProp<any>;
}

export default function SignUpScreen(props: SignUpScreenProps) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [fail, setFail] = useState(false);
  const [dup, setDup] = useState(true);
  const [dup2, setDup2] = useState(false);

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
      });
      
      const data = await response.json();
      if (response.ok && dup===false) {
        // 회원가입 성공 처리
        console.log('Sign up successful');
        navigation.navigate('SignIn'); // 회원가입 후 로그인 화면으로 이동
      } else {
        console.log('Sign up failed:', data.message);
        setFail(true);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setFail(true);
    }
  };

  const handleDup = async () => {
    try {
      const response = await fetch('http://localhost:3000/dup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      if (response.ok) {
        if (data.isDuplicate) {
          // 이메일이 이미 중복되는 경우
          setDup(true);
          setDup2(true);
        } else {
          // 이메일이 중복되지 않는 경우
          setDup(false);
          setDup2(false);
        }
      } else {
        console.log('Failed to check email duplication');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Image source={Logo} style={{ width: 150, height: 150 }} />
      <Text style={styles.header}>나 이 스</Text>
      <Text style={styles.header2}>마    켓</Text>
      {/* <View style={styles.inputContainer}> */}
        <TextInput
          placeholder={"이메일"}
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={styles.input}
        />
        <Button
          title="중복 확인"
          buttonStyle={{
            borderColor: '#FFA000',
          }}
          type="outline"
          titleStyle={{ color: '#FFA000' }}
          onPress={handleDup}
          // containerStyle={{
          //   marginLeft: 10,
          // }}
        />
        {dup && (
        <Text style={styles.failText}>이메일 중복 확인을 해주세요.</Text>
        )}
        {dup2 && (
        <Text style={styles.failText}>중복된 이메일입니다.</Text>
        )}
      {/* </View> */}
      <TextInput
        placeholder={"비밀번호"}
        autoCapitalize="none"
        returnKeyType="next"
        onChangeText={(text) => setPassword(text)}
        value={password}
        style={styles.input}
        secureTextEntry={true}
      />
      <TextInput
        placeholder={"비밀번호 확인"}
        autoCapitalize="none"
        returnKeyType="next"
        onChangeText={(text) => setPassword2(text)}
        value={password2}
        style={styles.input}
        secureTextEntry={true}
      />
      {fail && (
        <Text style={styles.failText}>회원가입에 실패했습니다.</Text>
      )}
      <Button
        title="회원 가입"
        onPress={handleSignUp}
        // containerStyle={{
        //   marginVertical: 10,
        // }}
        titleStyle={{
          color: "#fff", // 텍스트 색상을 흰색으로
          //fontWeight: "bold", // 볼드체
        }}
      />
      <Button
        title="로그인 가기"
        onPress={() => navigation.navigate('SignIn')}

        titleStyle={{
          color: "#fff", // 텍스트 색상을 흰색으로
          //fontWeight: "bold", // 볼드체
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  input: {
    width: "75%",
    height: 40,
    borderBottomWidth: 1.5,
    padding: 10, // 텍스트와 테두리 사이의 여백
    fontSize: 16,
    marginVertical: 5,
  },
  inputText: {
    flex: 1,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    paddingVertical: 12,
  },
  header2: {
    fontSize: 25,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
  },
  failText: {
    color: "red",
    marginTop: 10,
  },
});