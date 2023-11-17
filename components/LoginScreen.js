import React from "react";
import { Text, View, StyleSheet, TextInput, Pressable, Image} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const logo = require("../assets/white_text_logo.png")

export default function LoginScreen(){

    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const login = function(){
        return ""
    }

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
                {/* <Image source={logo}/> */}
                <TextInput 
                    style={styles.inputBox} 
                    onChangeText={setUsername}
                    value={username}
                    placeholder="username"
                    placeholderTextColor={'#DF85FF'}
                />
                <TextInput 
                    style={styles.inputBox} 
                    onChangeText={setPassword}
                    value={password}
                    placeholder="password"
                    placeholderTextColor={'#DF85FF'}
                />
                <Pressable style={styles.loginButton} onPress={login}>
                    <Text style={styles.loginText}>Login</Text>
                </Pressable>
            </View>
            <View style={styles.textContainer}>
                <Text>Don't have an account? </Text>
                <Text style={styles.signUpText}>Sign Up. </Text>
            </View>
            </LinearGradient>
    )
}

const styles = StyleSheet.create({  
    background: {
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: 20
      },
    mainContainer: {
        alignItems: "center"
    },

    textContainer: {
        flexDirection: "row",
        justifyContent: "center",
    }, 

    titleText: {
        fontSize: 50,
        fontWeight: "600",
        letterSpacing: "-1px",
        color: "white",
        marginBottom: 20
    },

    inputBox: {
        color: "green",
        height: 45,
        fontSize: 20,
        width: 300,
        margin: 12,
        padding: 10,
        backgroundColor: "#F1C8FF",
        borderRadius: 12
        
       
    },

    loginButton: {
        marginTop: 18,
        width: 300,
        backgroundColor: "#CF45FF",
        height: 45,
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },

    loginText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },

    signUpText: {
        color: "#DF85FF",
        fontWeight: "700"
    }

    
}); 