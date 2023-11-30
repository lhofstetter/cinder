import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, View, Image, ScrollView } from "react-native";
import { PreviewImage } from "./SetPost";
import * as SecureStore from 'expo-secure-store';
import { profileStyles } from "../styles";

export default function Profile() {

  async function getUserInfo() {
    const authCookie = await SecureStore.getItemAsync("cookie");
    const response = await axios.get('https://cinder-server2.fly.dev/account', {
      headers: {
        "cookie": authCookie
      }
    });

    const {owned_listings, id, username, profile_pic, phone_number, class_year, bio} = response.data

    setUser({
      name: username,
      phone_number,
      picture: profile_pic,
      year: class_year,
      bio: bio,
      listings: owned_listings
    });
  }

  useEffect(() => {getUserInfo()}, []);


  const [user, setUser] = useState();

  //images to be replaced with listing component probably

  if (!user) {
    return <></>;
  }

  return (
    //container
    <ScrollView
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
        {user.listings.map((imageData) => ( <Image style={profileStyles.listing} source={{uri: imageData.image_links[0]}} ></Image>))}
      </View>
    </ScrollView>
  );
}
