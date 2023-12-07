import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { PreviewImage } from "./SetPost";
import { profileStyles } from "../styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

const samplepfp = require("../assets/samplepfp.png");
const star = require("../assets/star.png");
const emptyStar = require("../assets/star_unfilled.png");

const c0 = require("../assets/clothing0.png");
const c1 = require("../assets/clothing1.png");
const c2 = require("../assets/clothing2.png");
const c3 = require("../assets/clothing3.png");
const c4 = require("../assets/clothing4.png");
const c5 = require("../assets/clothing5.png");
const c6 = require("../assets/clothing6.png");
const c7 = require("../assets/clothing7.png");
const c8 = require("../assets/clothing8.png");
const c9 = require("../assets/clothing9.png");
const c10 = require("../assets/clothing10.png");
const c11 = require("../assets/clothing11.png");

const images = [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c1, c2, c4, c7, c9, c10];

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const details = route.params;

  useEffect(() => {
    console.log(details);
    async function getUserInfo() {
      if (details === undefined) {
        let cookie = await SecureStore.getItemAsync("cookie");
        let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));

        const response = await fetch('https://cinder-server2.fly.dev/account', {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': 'auth_session=' + auth,
            'Origin': 'https://cinder-server2.fly.dev/./'
          }
        });
        console.log(response);
        let future = await response.json();
        const {owned_listings, id, username, profile_pic, phone_number, class_year, bio} = future;
    
        setUser({
          name: username,
          picture: profile_pic,
          year: class_year,
          bio: bio,
          listings: owned_listings,
          phone_number,
        });
      } else {
        setUser({
          name: details.profile.username,
          picture: details.profile.profile_pic,
          year: details.profile.class_year,
          bio: details.profile.bio,
          listings: details.profile.owned_listings,
          phone_number: details.profile.phone_number
        });
      }
    }

    getUserInfo();
  }, []);
  

  //images to be replaced with listing component probably

  return (
    <View>
    {user == null ? <></> : <ScrollView
    style={profileStyles.scrollContainer}
  >
    <View
      style={{
        paddingHorizontal: 4,
      }}
    >
      <View
        style={profileStyles.userContainerMinusBio}
      >
        <Image
          style={profileStyles.userProfilePic}
          source={{uri: user.picture}}
        ></Image>
        <View
          style={profileStyles.usernameContainer}
        >
          <Text
            style={profileStyles.username}
          >
            {" "}
            {user.name}{" "}
          </Text>
          <Text> Class of {user.year} </Text>
          <Text> Phone number: {user.phone_number} </Text>

        </View>
      </View>
      <Text
        style={profileStyles.userBio}
      >
        {user.bio}
      </Text>
    </View>

    <View
      style={profileStyles.listingsContainer}
    >
      {user.listings.map((listing) => (
      <Pressable onPress={() => {
        navigation.navigate("Post", {
          title: listing.listing_name,
          image: { images: listing.image_links },
          selectedSize: listing.size,
          selectedType: listing.category,
          description: listing.description,
          tags: listing.tags,
        });
      }}>
        <Image
          style={profileStyles.listing}
          source={{uri: listing.image_links[0]}}
        />
      </Pressable>)
    )}
    </View>
  </ScrollView>}
  </View>
  );
}
