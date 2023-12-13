import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, Pressable } from "react-native";
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
        console.log(response);
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

    getUserInfo();
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
