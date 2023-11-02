import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Text,
  View,
  Button,
  Image,
  Pressable,
  Platform,
  ActionSheetIOS,
  TextInput,
} from "react-native";
import * as Font from 'expo-font';
import { useRoute } from "@react-navigation/native";

const styles = {
  title: {
    fontFamily: 'Inter',
    fontSize: 24,
    borderBottomColor:"black", 
    borderBottomWidth: 1, 
    width:200,
    marginLeft: 25,
    marginTop: 40,
  },
  postDescription: {
    backgroundColor: "#D9D9D9",
    width: "60%",
    height: 100,
    marginLeft:150,
    borderRadius:5,
    paddingLeft:10,
    top:-100,
  },
  previewImageWeb: {
     display:"flex",
     marginLeft: 50,
     borderRadius: 10,
     marginTop: 10,
  },
  previewImageMobile: {
    display:"flex",
    marginLeft: 25,
    borderRadius: 10,
    marginTop: 20,
 },
}


const CustomText = (props) => {
    const [fontLoaded, setFontLoaded] = useState(false);
  
    useEffect(() => {
      async function loadFont() {
        await Font.loadAsync({
          'Inter': require('../assets/fonts/static/Inter-Medium.ttf'),
        });
  
        setFontLoaded(true);
      }
  
      loadFont();
    }, []);
  
    if (!fontLoaded) {
      return <Text>Loading...</Text>;
    }
    
    return (
      <Text style={{ ...props.style, fontFamily: 'Inter' }}>
        {props.children}
      </Text>
    );
  };

  function PreviewImage({ imageSrc }) {
    if (Platform.OS == 'web') {
      return (<img
          src={imageSrc.image}
          style={styles.previewImageWeb}
          width={100}
          height={100}
          alt={"preview image"}/>);
    } else {
      console.log(imageSrc.image);
      return (
        <Image source={{uri:imageSrc.image}} width={100} height={100} style={styles.previewImageMobile}/>
      );
    }
  }

  export default function PreviewPost() {
    const [text, setText] = useState("Write a title");
    const [description, setDescription] = useState("Type out your description!");
    const [fontLoaded, setFontLoaded] = useState(false);
    const route = useRoute();

    let image = route.params;

    useEffect(() => {
      async function loadFont() {
        await Font.loadAsync({
          'Inter': require('../assets/fonts/static/Inter-Medium.ttf'),
        });
  
        setFontLoaded(true);
      }
  
      loadFont();
    }, []);

    return (
      <View>
        <TextInput editable onChangeText={setText} value={text} style={styles.title}></TextInput>
        <PreviewImage imageSrc={image}/>
        <TextInput editable multiline onChangeText={setDescription} value={description} style={styles.postDescription}></TextInput>
      </View>
    );
  }