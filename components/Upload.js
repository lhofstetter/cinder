import React, { useState } from "react";
import {
  ImageBackground,
  Text,
  View,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  Uploady,
  useItemFinishListener,
  useItemProgressListener,
  useUploady,
} from "@rpldy/uploady";

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
  if (width != null && height != null) {
    if (Platform.OS == "web") {
      console.log(imageData);
      return (
        <img
          src={imageData.imageData}
          style={{ borderRadius: 10 }}
          width={width}
          height={height}
          alt={"image thingy"}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: imageData.uri }}
          style={[styles.uploadborder, { width: width, height: height }]}
          height={height}
          width={width}
          borderRadius={10}
        />
      );
    }
  } else {
    if (Platform.OS == "web") {
      console.log(imageData);
      return (
        <img
          src={imageData.imageData}
          style={{ borderRadius: 10 }}
          width={400}
          height={600}
          alt={"image thingy"}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: imageData.uri }}
          style={[{ display: "flex", width: width, height: height }]}
          height={600}
          width={400}
          borderRadius={10}
        />
      );
    }
  }
}

export default function UploadItem() {
  const [upload, setUpload] = useState(false); // create a state for whether we are currently uploading or not (whether user has hit the uplaod button)
  const { showActionSheetWithOptions } = useActionSheet();
  const [itemImage, setItemImage] = useState(null);
  let inputElement;

  const UploadImage = (props) => {
    const handleClick = (event) => {
      inputElement.click();
    };
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
                console.log(inputElement.value);
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadcontainer}>
        <Pressable
          onPress={() => {
            const options = [
              "Choose Photo from Library",
              "Take Photo",
              "Cancel",
            ];

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
                        launchImageLibrary({ noData: true }, (response) => {
                          if (response.assets != null) {
                            setItemImage(response.assets[0]);
                          }
                        });
                        break;

                      case 1:
                        launchCamera({ mediaType: "photo" }, (response) => {});
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
                        launchImageLibrary({ noData: true }, (response) => {});
                        break;

                      case 2:
                        launchCamera({ mediaType: "photo" }, (response) => {});
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
          {itemImage == null ? (
            <UploadImage />
          ) : (
            <DisplayPhoto imageData={itemImage} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
