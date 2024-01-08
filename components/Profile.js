import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { Svg, Path } from 'react-native-svg';
import { profileStyles } from "../styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const details = route.params;

  useEffect(() => {
    async function getUserInfo() {
      if (details === undefined) {
        let cookie = await SecureStore.getItemAsync("cookie");
        let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));

        const response = await fetch("https://cinder-server2.fly.dev/account", {
          headers: {
            "Content-Type": "application/json",
            Cookie: "auth_session=" + auth,
            Origin: "https://cinder-server2.fly.dev/./",
          },
        });
        let future = await response.json();
        const { owned_listings, id, username, profile_pic, phone_number, class_year, bio } = future;

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
          phone_number: details.profile.phone_number,
        });
      }
    }

    async function profileSettings() {
      if (details === undefined) {
        navigation.setOptions({
          headerRight: () => (
            <Pressable onPress={() => {
              navigation.navigate("Settings", {});
          }} style={{display:'flex', top:"2.5%"}}>
            <Svg xmlns="http://www.w3.org/2000/svg" height={30} viewBox="0 -960 960 960" width={30}>
              <Path
                d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
                fill="black" 
              />
            </Svg>
          </Pressable>
          ),
        })
      }
    }

    getUserInfo();
    profileSettings();
  }, []);

  return (
    <View>
      {user == null ? (
        <></>
      ) : (
        <ScrollView style={profileStyles.scrollContainer}>
          <View
            style={{
              paddingHorizontal: 4,
            }}
          >
            <View style={profileStyles.userContainerMinusBio}>
              <Image style={profileStyles.userProfilePic} source={{ uri: user.picture }}></Image>
              <View style={profileStyles.usernameContainer}>
                <Text style={profileStyles.username}> {user.name} </Text>
                <Text> Class of {user.year} </Text>
                <Text> Phone number: {user.phone_number} </Text>
              </View>
            </View>
            <Text style={profileStyles.userBio}>{user.bio}</Text>
          </View>

          <View style={profileStyles.listingsContainer}>
            {user.listings.map((listing) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("Post", {
                    title: listing.listing_name,
                    image: { images: listing.image_links },
                    selectedSize: listing.size,
                    selectedType: listing.category,
                    description: listing.description,
                    tags: listing.tags,
                  });
                }}
              >
                <Image style={profileStyles.listing} source={{ uri: listing.image_links[0] }} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
