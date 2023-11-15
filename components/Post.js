import React, { useState, useEffect } from "react";
import { Text, View, Image, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { postStyles } from "../styles.js";

const backArrow = require('../assets/backarrow.png');

/**
 * @description This component creates a Post to be rendered to the front end. 
 * Uses useRoute() and expects route.params to contain an image asset from expo-image-picker, the title of the post,
 * the selectedSize, selectedType, description and tags. 
 * @param {React.JSX.Element} navigateRight - takes in a React element to render in the top right corner of the Post.
 * This element should call navigation.navigate() when user interacts with it. 
 */
export default function Post({ navigateRight }) {
    const route = useRoute();
    const navigation = useNavigation();

    let postDetails = route.params;

    useEffect(() => {
        navigation.setOptions({headerRight: () => (
            navigateRight
         ), 
         headerLeft: () => (
                <Pressable onPress={()=> {
                    navigation.goBack();
                }}
                >
                <Image width={75} height={75} style={postStyles.postBackButton} source={backArrow}/>
                </Pressable>
            )});
    }, []);

    return (
        <View>
          <Image source={{ uri: postDetails.image.image.uri }} style={{ width: 500, height: 500 }} />
          <View style={postStyles.postMobileTitles}>
            <Text style={[postStyles.postMobileTitle, {fontFamily:'Inter'}]}>{postDetails.title}</Text>
            <Text style={postStyles.postMobileSubtitle}>
              Size {postDetails.selectedSize} • {postDetails.selectedType}
            </Text>
          </View>
          <View style={postStyles.seperator} />
          <View style={postStyles.profile}></View>
          <View style={postStyles.postTextContainer}>
            <Text style={postStyles.postDescription}>{postDetails.description}</Text>
            <Text style={postStyles.postTags}>{postDetails.tags}</Text>
          </View>
        </View>
      );
}