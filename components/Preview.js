import React, { useState, useEffect } from "react";
import { Text, View, Image, Pressable, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Post from "./Post.js";
import { postStyles } from "../styles";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';


export default function PreviewPost() {
  const route = useRoute();
  const navigation = useNavigation();

  let details = route.params;

  const postImage = async (imageUris) => {
      let result = [];
      
      for (let i = 0; i < imageUris.length; i++) {
        if (imageUris[i].fileSize / (1000000) >= 5) { // if image size is greater than 5 MB, compress when converting to JPEG
          let temp = await manipulateAsync(imageUris[i].uri, [], {compress:0.75, format:SaveFormat.JPEG});
          result.push(temp);
        } else {
          let temp = await manipulateAsync(imageUris[i].uri, [], {compress:1, format:SaveFormat.JPEG});
          result.push(temp);
        }
      }
      

      let form = new FormData();
      for (let i = 0; i < result.length; i++) {
        form.append("files[]", {
          uri: result[i].uri,
          type: 'image/jpeg',
          name: imageUris[i].fileName,
        });
      }
      form.append("listing_name", details.title);
      form.append("description", details.description);
      form.append("category", details.selectedType);
      form.append("tags", tags.split(" "));
      
      return fetch("https://cinder-server2.fly.dev/listing", {
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
      postImage(details.image.images).catch(() => {
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
