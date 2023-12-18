import React, { useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import * as SecureStore from 'expo-secure-store';
import { Text, View, StyleSheet, TextInput, Pressable, Image, Alert, Keyboard, ScrollView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useActionSheet } from "@expo/react-native-action-sheet";
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
            let word = await res.text();
            console.log(res.headers["set-cookie"]);
            switch (word) {
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
                case "OK":
                    await SecureStore.setItemAsync("cookie", String(res.headers["set-cookie"]));
                    navigation.navigate("App Path");
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

  const handlePhoneNumberInput = (text) => {
    if (text.length === 10) /** @todo support non-US phone numbers */
        classOfRef.current.focus();
    setPhoneNumber(text.replace(/\D/g, ""));
  }

  const handleYearInput = (text) => {
    if (text.length === 4)
        bioRef.current.focus();
    setClassOf(text.replace(/\D/g, ""));
  }

  const bioRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const phoneNumberRef = useRef();
  const classOfRef = useRef();

    return(
        <ScrollView style={styles.container} scrollEnabled={false} keyboardShouldPersistTaps={"handled"} keyboardDismissMode="onDrag">


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
                        autoCapitalize="none"
                        enterKeyHint="next"
                        onSubmitEditing={() => {
                            passwordRef.current.focus();
                        }}
                        onKeyPress={(e) => {
                            if (e.nativeEvent.key === "Enter") {
                                passwordRef.current.focus();
                            }
                        }}
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
                        autoCapitalize="none"
                        enterKeyHint="next"
                        ref={passwordRef}
                        onSubmitEditing={() => {
                            confirmPasswordRef.current.focus();
                        }}
                        onKeyPress={(e) => {
                            if (e.nativeEvent.key === "Enter") {
                                confirmPasswordRef.current.focus();
                            }
                        }}
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
                        enterKeyHint="next"
                        autoCapitalize="none"
                        ref={confirmPasswordRef}
                        onSubmitEditing={() => {
                            phoneNumberRef.current.focus();
                        }}
                        onKeyPress={(e) => {
                            if (e.nativeEvent.key === "Enter") {
                                phoneNumberRef.current.focus();
                            }
                        }}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Phone Number
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={handlePhoneNumberInput}
                        value={phoneNumber}
                        inputMode="numeric"
                        ref={phoneNumberRef}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Class Of
                    </Text>
                    <TextInput 
                        style={styles.inputBox} 
                        onChangeText={handleYearInput}
                        value={classOf}
                        inputMode="numeric"
                        maxLength={4}
                        ref={classOfRef}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.inputLabel}>
                        Bio
                    </Text>
                    <TextInput 
                        style={styles.inputBoxBio} 
                        onChangeText={setBio}
                        value={bio}
                        inputMode="text"
                        autoCapitalize="none"
                        multiline
                        ref={bioRef}
                        enterKeyHint="done"
                        onKeyPress={(e) => {
                            if (e.nativeEvent.key === "Enter") {
                                Keyboard.dismiss();
                            }
                        }}
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

        </ScrollView>
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
        backgroundColor: '#D9D9D9',
        top:25,
    },

    inputBox:{
        backgroundColor: '#D9D9D9',
        width: "50%",
        height: 32,
        borderRadius: 8,
        paddingLeft:"2%",
    },

    inputBoxBio:{
        backgroundColor: '#D9D9D9',
        width: "50%",
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
