import React, { useState, useEffect } from "react";
import { Text, View, Image, Pressable, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import Post from "./Post.js";
import { postStyles } from "../styles";


export default function PreviewPost() {
  const route = useRoute();
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);

  let details = route.params;

  const postImage = async (imageUri) => {
      let form = new FormData();
      form.append("file", {uri: imageUri.uri, type:imageUri.fileType, name:imageUri.fileName}); 
      form.append("listing_name", details.title);
      form.append("description", details.description);
      form.append("category", details.selectedType);
      form.append("tags", tags.split(" "));
      form.append("price", Number(details.price.replace("$", "")));
      return fetch("http://127.0.0.1:3000/listing", {
          method: "POST",
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          body: form,
      });
  }

  let preTags = [];
  if (details.tags.indexOf(",") != -1) {
      preTags = details.tags.split(",");
  }  
  
  let tags = "";
  
  for (let i = 0; i < preTags.length; i++) {
      while (preTags[i].indexOf(" ") != -1) {
          preTags[i] = preTags[i].replace(" ", "");
      }
      tags += ("#" + preTags[i] + " ");
  }

  return (
    <Post navigateRight={(<Pressable onPress={()=> {
      postImage(details.image.image).catch(() => {
        Alert.alert('Post error :(', 'Your clothing was too drippy for our server to handle. We\'ve updated it now, so go ahead and try posting again.', [
          { text: "Sounds good", style: 'cancel', onPress: () => {} },
        ])
      })
      navigation.navigate("Swipe");
    }}
  >
    <Text style={postStyles.postMobile}>Post</Text>
  </Pressable>)}/>
  );
}
