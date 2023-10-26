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
import Uploady from "@rpldy/uploady";
import { UploadButton, asUploadButton } from "@rpldy/upload-button";

const styles = {
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
    width: 100,
    height: 100,
  },
};

export default function UploadItem() {
  const [upload, setUpload] = useState(false); // create a state for whether we are currently uploading or not (whether user has hit the uplaod button)
  const { showActionSheetWithOptions } = useActionSheet();

  const UploadImage = asUploadButton((props) => {
    return (
      <ImageBackground
        {...props}
        source={require("../assets/Upload_Icon.png")}
        style={styles.uploadborder}
      >
        <Text></Text>
      </ImageBackground>
    );
  });

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
          <Uploady destination={{ url: "localhost" }}>
            <UploadImage />
          </Uploady>
        </Pressable>
      </View>
    </View>
  );
}
