import React from "react";
import { Text, View, StyleSheet, TextInput, Pressable, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const logo = require("../assets/white_text_logo.png");

export default function LoginScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation();


    const login = async function() {
        let encrypted_password = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
        fetch("https://cinder-server2.fly.dev/auth/login/", {
            method:"POST",
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                username:String(username),
                password:String(encrypted_password),
            }
        }).then(async (res) => {
            let status = await res.text();
            console.log(res);
            switch (status) {
                case "Invalid username":
                    Alert.alert("Invalid Username", "Sorry! A valid username is between 5 and 30 characters.");
                    break;
                case "Invalid password":
                    Alert.alert("Invalid Password", "Sorry! A valid password is more than 6 characters.");
                    break;
                    // must be > 6 chars and < 255
                case "Incorrect username or password":
                    Alert.alert("Incorrect username or password", "Go ahead and check your spelling, then try again. If it still doesn't work, make sure you've made an account!");
                    break;
                case "OK":
                    await SecureStore.setItemAsync("cookie", String(res.headers["set-cookie"][0]));
                    navigation.navigate("App Path");
                    break;
                default:
                    Alert.alert("Error", "An unknown problem occurred. Please try again.");
                    break;
            }
            
        });
    };

    return(
            <LinearGradient
        colors={['#BE1CF7', '#FFFFFF']}
        style={styles.background}
      >     
            <View>
                
            </View>
            <View style={styles.mainContainer}>
                <Text style={styles.titleText}>
                    cindr_
                </Text>
                <TextInput 
                    style={styles.inputBox} 
                    onChangeText={setUsername}
                    value={username}
                    placeholder="username"
                    placeholderTextColor={'#DF85FF'}
                    autoCapitalize="none"
                />
                <TextInput 
                    style={styles.inputBox} 
                    onChangeText={setPassword}
                    value={password}
                    placeholder="password"
                    secureTextEntry={true}
                    placeholderTextColor={'#DF85FF'}
                    autoCapitalize="none"
                />
                <Pressable style={styles.loginButton} onPress={login}>
                    <Text style={styles.loginText}>Login</Text>
                </Pressable>
            </View>
            <View style={styles.textContainer}>
                <Text>Don't have an account? </Text>
                <Pressable onPress={() => {navigation.navigate("Sign Up")}}>
                    <Text style={styles.signUpText}>Sign Up.</Text>
                </Pressable>
            </View>
            </LinearGradient>
    )
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
  },
  mainContainer: {
    alignItems: "center",
  },

  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  titleText: {
    fontSize: 50,
    fontWeight: "600",
    letterSpacing: -1,
    color: "white",
    marginBottom: 20,
  },

  inputBox: {
    color: "black",
    height: 45,
    fontSize: 20,
    width: 300,
    margin: 12,
    padding: 10,
    backgroundColor: "#F1C8FF",
    borderRadius: 12,
  },

  loginButton: {
    marginTop: 18,
    width: 300,
    backgroundColor: "#CF45FF",
    height: 45,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  loginText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  signUpText: {
    color: "#DF85FF",
    fontWeight: "700",
  },
});
