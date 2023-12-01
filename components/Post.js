import React, { useState, useEffect } from "react";
import { Text, View, Image, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { postStyles } from "../styles.js";
import Gallery from "react-native-image-gallery";

const backArrow = require("../assets/backarrow.png");

/**
 * @description This component creates a Post to be rendered to the front end.
 * Uses useRoute() and expects route.params to contain an image asset from expo-image-picker, the title of the post,
 * the selectedSize, selectedType, description and tags.
 * @param {React.JSX.Element} navigateRight - takes in a React element to render in the top right corner of the Post.
 * This element should call navigation.navigate() when user interacts with it.
 */
export default function Post({ navigateRight }) {
  const [images, setImages] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();

  let postDetails = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => navigateRight,
      headerLeft: () => (
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image width={75} height={75} style={postStyles.postBackButton} source={backArrow} />
        </Pressable>
      ),
    });
    if (images == null) {
      let temp = [];
      for (let i = 0; i < postDetails.image.images.length; i++) {
        if (postDetails.image.images[i].uri == undefined)
          temp.push({ source: { uri: postDetails.image.images[i] }, dimensions: { width: 481, height: 481 } });
        else temp.push({ source: { uri: postDetails.image.images[i].uri }, dimensions: { width: 481, height: 481 } });
      }
      setImages(temp);
    }
  }, [images]);

  return (
    <View>
      {images != null ? (
        <View>
          <View style={{ width: 500, height: 500 }}>
            <Gallery
              images={images}
              imageComponent={(image) => {
                return <Image width={481} height={481} source={{ uri: image.source.uri }} />;
              }}
            />
          </View>
          <View style={postStyles.postMobileTitles}>
            <Text style={[postStyles.postMobileTitle, { fontFamily: "Inter" }]}>{postDetails.title}</Text>
            <Text style={postStyles.postMobileSubtitle}>
              {postDetails.selectedSize ? `Size: ${postDetails.selectedSize} • ` : ""}
              {postDetails.selectedWaist ? `Size: ${postDetails.selectedWaist} • ` : ""}
              {postDetails.selectedType}
            </Text>
          </View>
          <View style={postStyles.seperator} />
          <View style={postStyles.profile}></View>
          <View style={postStyles.postTextContainer}>
            <Text style={postStyles.postDescription}>{postDetails.description}</Text>
            <Text style={postStyles.postTags}>{postDetails.tags}</Text>
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}
