import React from "react";
import * as Crypto from "expo-crypto";
import axios from "axios";
import { Text, View, StyleSheet, TextInput, Pressable, Image, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

const arrow = require("../assets/back_arrow.png")

export default function AccountCreate(){
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    
    const navigation = useNavigation();
    let passwd;

    const handleSignUp = async function (){
        if (password !== confirmPassword){
            Alert.alert("Error", "Confirmed password does not match.");
            return;
        }
        passwd = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
        await axios.post("https://cinder-server2.fly.dev/auth/signup/", {
            username: String(username),
            password:String(passwd),
            phone_number:String(phoneNumber),
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(async (res) => {
            await SecureStore.setItemAsync("cookie", String(res.headers["set-cookie"][0]));
            navigation.navigate("App Path");
        }, (e) => {
            const error = e.response.data;
            switch (error) {
                case "Invalid username":
                    Alert.alert("Invalid Username", "Username must be between 5 and 30 characters.");
                    break;
                case "Invalid password":
                    Alert.alert("Invalid Password", "Password must more than 6 characters.");
                    break;
                    // must be > 6 chars and < 255
                case "Username already taken":
                    Alert.alert("Username Taken", "Please enter a different username. ");
                    break;
                default:
                    Alert.alert("Error", "An unknown problem occured, please try again later.");
                    break;
            }
        });
    }

    return(
        <View style={styles.container}>


            <View style={styles.bar}>
            <Pressable onPress={() => {
                navigation.goBack();
            }}>
                <Image
                    style={styles.arrow}
                    source={arrow}
                 />
            </Pressable>
                
                <Text style={styles.title}>
                    Profile
                </Text>
                <View style={styles.empty}></View>
            </View>

            <View style={styles.main}>
                <View style={styles.field}>
                    <Text stlye={styles.inputLabel}>
                        Username
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Password
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={setPassword}
                        value={password}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Confirm Password
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Phone Number
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={setPhoneNumber}
                        value={phoneNumber}
                        inputMode="numeric"
                    />
                </View>
            </View>

            <Pressable 
                onPress={handleSignUp}
                style={({pressed}) => [
                    {
                      backgroundColor: pressed ? '#CF45FF' : '#DF85FF',
                    },
                    styles.saveButton,
                  ]}
            >
                    <Text style={styles.saveText}>Save</Text>
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        height: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
    }, 


    main: {
        paddingVertical: 30,
        marginBottom: "auto"
    },

    title: {
        fontSize: 22,
        fontWeight: "700"

    },

    bar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 30
    },

    empty: {
        width: 34
    },

    arrow: {
        width: 34,
        objectFit: "contain"
    },

    field: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10
    },

    inputLabel:{

    },

    inputBox:{
        backgroundColor: '#D9D9D9',
        width: 200,
        height: 32,
        borderRadius: 8,
        paddingLeft:"2%",
    },

    saveButton: {
        marginBottom: 18,
        width: "100%",
        height: 40,
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },

    saveText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
})
