import React, { useState } from "react";
import {
  ImageBackground,
  Text,
  View,
  Button,
  Image,
  Pressable,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Uploady, useItemFinishListener, useItemProgressListener, useUploady} from "@rpldy/uploady";
import { UploadButton, asUploadButton } from "@rpldy/upload-button";



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
};

export default function UploadItem() {
  const [upload, setUpload] = useState(false); // create a state for whether we are currently uploading or not (whether user has hit the uplaod button)
  const { showActionSheetWithOptions } = useActionSheet();
  const [itemImage, setItemImage] = useState(null);

  const UploadImage = asUploadButton((props) => {
    useItemFinishListener((item) => {      
      console.log(item.uploadResponse.data);
      let binary = '';
      let bytes = new Uint8Array(item.uploadResponse.data.file.data.data);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let img = window.btoa(binary);
      let w, h;
      Image.getSize('data:' + item.file.type + ';base64,' + img, (width, height) => { h = height; w = width;});
      setItemImage([img, item.file.type, [w, h]]);
    });

    return ( itemImage == null ?
      <ImageBackground
        {...props}
        source={require("../assets/Upload_Icon.png")}
        style={[styles.uploadborder, {width: 100, height: 100}]}
      >
        <Text></Text>
      </ImageBackground>
     : <ImageBackground
     {...props}
     source={{uri: 'data:' + itemImage[1] + ';base64,' + itemImage[0]}}
     style={[styles.uploadborder, { width: itemImage[2][0], height: itemImage[2][1]}]}
   >
     <Text></Text>
   </ImageBackground>
  )});

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
                        launchImageLibrary({ noData: true }, (response) => {
                        });
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
          <Uploady destination={{ url: "http://localhost:3000/echoimage" }}>
            <UploadImage />
          </Uploady>
        </Pressable>
      </View>
    </View>
  );
}
