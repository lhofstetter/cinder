import React, { useEffect, useState } from "react";
import { ImageBackground, Text, View, Image, Pressable, Platform } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

let styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadcontainer: {
    borderWidth: 1,
    marginTop: "6%",
    borderStyle: "solid",
    borderColor: "#dbd8ce",
    borderRadius: 5,
    width: 400,
    height: 600,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 0,
  },
  uploadborder: {
    display: "flex",
  },
  listingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
};

function DisplayPhoto(imageData, width, height) {
  const navigation = useNavigation();
  console.log(imageData.imageData);
  if (width != null && height != null) {
    if (Platform.OS == "web") {
      return (
        <img
          src={imageData.imageData.uri}
          style={{ borderRadius: 10 }}
          width={width}
          height={height}
          alt={"image thingy"}
          onLoad={() => {
            setTimeout(() => {
              navigation.navigate("New Listing", {
                image: imageData.imageData,
              });
            }, 1000);
          }}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: imageData.imageData.uri }}
          style={[styles.uploadborder, { width: width, height: height }]}
          borderRadius={10}
          onLoad={() => {
            setTimeout(() => {
              navigation.navigate("New Listing", {
                image: imageData.imageData,
              });
            }, 1000);
          }}
        />
      );
    }
  } else {
    if (Platform.OS == "web") {
      return (
        <img
          src={imageData.imageData.uri}
          style={{ borderRadius: 10 }}
          width={400}
          height={600}
          alt={"image thingy"}
          onLoad={() => {
            setTimeout(() => {
              navigation.navigate("New Listing", {
                image: imageData.imageData,
              });
            }, 1000);
          }}
        />
      );
    } else {
      return (
        <Image
          source={{ uri:imageData.imageData.uri }}
          style={[{ display: "flex" }]}
          height={600}
          width={400}
          borderRadius={10}
          onLoad={() => {
            setTimeout(() => {
              navigation.navigate("New Listing", {
                image: imageData.imageData,
              });
            }, 1000);
          }}
        />
      );
    }
  }
}

export default function UploadItem() {
  const [upload, setUpload] = useState(false); // create a state for whether we are currently uploading or not (whether user has hit the uplaod button)
  const { showActionSheetWithOptions } = useActionSheet();
  const [itemImage, setItemImage] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  let inputElement;

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
    requestPermission();
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setItemImage(result.assets[0]);
    }
  };

  const UploadImage = (props) => {
    const handleClick = () => {
      inputElement.click();
    };

    if (Platform.OS == "web") {
      return (
        <Pressable onPressIn={handleClick}>
          <ImageBackground
            {...props}
            source={require("../assets/Upload_Icon.png")}
            style={[styles.uploadborder, { width: 100, height: 100 }]}
          >
            {Platform.OS == "web" ? (
              <input
                name="image"
                type="file"
                style={{ opacity: 0.0 }}
                ref={(input) => (inputElement = input)}
                onChange={() => {
                  let img = URL.createObjectURL(inputElement.files[0]);
                  setItemImage(img);
                }}
              />
            ) : (
              <Text></Text>
            )}
          </ImageBackground>
        </Pressable>
      );
    } else {
      return (
        <ImageBackground
          {...props}
          source={require("../assets/Upload_Icon.png")}
          style={[styles.uploadborder, { width: 100, height: 100 }]}
        >
          <Text></Text>
        </ImageBackground>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadcontainer}>
        <Pressable
          onPress={() => {
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
          }}
        >
          {itemImage == null ? <UploadImage /> : <DisplayPhoto imageData={itemImage} />}
        </Pressable>
      </View>
    </View>
  );
}
