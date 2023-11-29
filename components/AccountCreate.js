import React from "react";
import * as Crypto from "expo-crypto";
import axios from "axios";
import { Text, View, StyleSheet, TextInput, Pressable, Image, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const arrow = require("../assets/back_arrow.png")

export default function AccountCreate(){
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [classOf, setClassOf] = React.useState("");
    const [bio, setBio] = React.useState("");
    const { showActionSheetWithOptions } = useActionSheet();
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [itemImage, setItemImage] = React.useState();

    const navigation = useNavigation();
    let passwd;

    React.useEffect(() => {
        const permission = async () => {
            await requestPermission();
        }

        if (status == null || !status.granted)
            permission();
    }, []);

    const handleSignUp = async function (){
        if (password !== confirmPassword){
            Alert.alert("Error", "Confirmed password does not match.");
            return;
        }

        passwd = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);

        let form = new FormData();
        result = await manipulateAsync(itemImage.uri, [], {compress:1, format:SaveFormat.JPEG});
        form.append("file", {uri: result.uri, type:"image/jpeg", name:itemImage.fileName}); 
        form.append("username", username);
        form.append("password", passwd);
        form.append("phone_number", Number(phoneNumber));
        form.append("bio", bio);
        form.append("class_year", Number(classOf));
        await fetch("https://cinder-server2.fly.dev/auth/signup/", {
            method:"POST",
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: form,
        }).then(async (res) => {
            await SecureStore.setItemAsync("cookie", String(res.headers["set-cookie"]));
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

    let result;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setItemImage(result.assets[0]);
    }
  };

  const takeImage = async () => {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

    if (!result.canceled) {
      setItemImage(result.assets[0]);
    }
  };

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
                    <Text style={styles.inputLabel}>
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
                        secureTextEntry={true}
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
                        secureTextEntry={true}
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
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Class Of
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={setClassOf}
                        value={classOf}
                        inputMode="numeric"
                        maxLength={4}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Bio
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={setBio}
                        value={bio}
                        inputMode="text"
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Profile Picture
                    </Text>
                    <Pressable style={styles.uploadBox} onPress={() => {
                        const options = ["Choose Photo from Library", "Take Photo", "Cancel"];
                        switch (Platform.OS) {
                        case "ios":
                            showActionSheetWithOptions(
                            {
                                options: options,
                                cancelButtonIndex: 2,
                            },
                            (selectedIndex) => {
                                switch (selectedIndex) {
                                case 0:
                                    pickImage();
                                    break;

                                case 1:
                                    takeImage();
                                    break;

                                case 2:
                                    break;
                                }
                            },
                            );
                            break;
                        case "web":
                            setUpload(true);
                            break;

                        case "android":
                            showActionSheetWithOptions(
                            {
                                options: options,
                                cancelButtonIndex: 2,
                            },
                            (selectedIndex) => {
                                switch (selectedIndex) {
                                case 1:
                                    pickImage();
                                    break;

                                case 2:
                                    takeImage();
                                    break;

                                case 3:
                                    break;
                                }
                            },
                            );
                            break;
                        default:
                            break;
                        }
                    }}>
                        {itemImage == undefined ? <></> : <Image source={{uri: itemImage.uri}} style={styles.profilePicture}/>}
                    </Pressable>
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

    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 100
    },

    uploadBox:{
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#D9D9D9'
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
