import React, { useEffect, useState } from "react";
import { Text, View, Image, Pressable, Platform, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";
import { Badge } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
import { uploadStyles, editStyles } from "../styles";

const blankUpload = require("../assets/blankupload.png");

function DisplayPhoto(imageData, width, height) {
  const navigation = useNavigation();
  if (width != null && height != null) {
      return (
        <Image
          source={{ uri: imageData.imageData.uri }}
          style={[uploadStyles.uploadborder, { width: width, height: height }]}
          borderRadius={10}
        />
      );
    } else {
      return (
        <Image
          source={{ uri:imageData.imageData.uri }}
          style={[{ display: "flex" }]}
          height={100}
          width={100}
          borderRadius={10}
        />
      );
  }
}

export default function Upload() {
  const [images, setImages] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const navigation = useNavigation();

  let result;
  let temp;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      temp = [];

      if (images != null)
        for (let i = 0; i < images.length; i++) {
          temp.push(images[i]);
        }
        
      for (let i = 0; i < result.assets.length; i++) {
        temp.push(result.assets[i]);
      }
      setImages(temp);
    }
  };

  const takeImage = async () => {
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      temp = [];
      
      if (images != null)
        for (let i = 0; i < images.length; i++) {
          temp.push(images[i]);
        }
      temp.push(result.assets);
      setImages(temp);
    }
  };

  useEffect(() => {
    const permission = async () => {
      await requestPermission();
    }
    if (status == null || !status.granted)
      permission();

    if (images == null) {
      navigation.setOptions({headerRight: () => (
          <Text style={editStyles.previewMobileInvalid}>Continue</Text>      
      )});
    } else {
      navigation.setOptions({headerRight: () => (
        <Pressable onPress={() => {
            navigation.navigate("New Listing", {
              images:images,
            });
        }}>
        <Text style={[editStyles.previewMobile, {fontFamily: "Inter"}]}>Continue</Text>
      </Pressable>
      )})
    }
  }, [images]);

  return (
    <View style={uploadStyles.container}>
      <Pressable style={uploadStyles.uploadPressable} onPress={() => {
        if (images != null && images.length == 5)
          Alert.alert("Upload Error", "Sorry, we only support uploading a maximum of 5 images at the moment.");
        else {
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
          }}
        }
        >
        <Image source={blankUpload}/>
      </Pressable>
      <Text style={uploadStyles.uploadedImagesTitle}>Current Photos</Text>
      {(images == null)  ? <Text style={uploadStyles.noImagesText}>No photos uploaded yet :( let's add some! </Text> : <View style={{alignItems:'stretch', display:'flex', flexDirection: 'row', flexWrap:'wrap', marginLeft: 15}}>{
        images.map((image, index) => (
           <View key={index} style={{ marginLeft:"5%", marginTop: "5%" }}>
                <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                <Badge style={{ position: 'absolute', top: -5, right: -5, backgroundColor: "#DF85FF" }}>{index + 1}</Badge>
           </View>
        ))}
        </View>
      }
    </View>
  );
  
}

