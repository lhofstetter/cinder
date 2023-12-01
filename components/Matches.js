import React, { useState, useEffect } from "react";
import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRoute, useNavigation } from "@react-navigation/native";

const matchedClothing = require("../assets/clothing0.png");
const samplepfp = require("../assets/samplepfp.png");
const rightArrow = require("../assets/right_arrow.png");

export default function Matches() {
  const [matches, setMatches] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    async function retrieveMatches() {
      let cookie = await SecureStore.getItemAsync("cookie");
      let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));
      let temp = [];

      let results = await fetch("https://cinder-server2.fly.dev/match/", {
        headers: {
          "Content-Type": "application/json",
          Cookie: "auth_session=" + auth,
          Origin: "https://cinder-server2.fly.dev/./",
        },
      });
      results = await results.json();

      if (results.message != null && results.message == "You have no matches") {
        return;
      }
      let users = Object.keys(results);
      for (let i = 0; i < users.length; i++) {
        temp.push({
          profile: results[users[i]]["their_account_info"],
          image: results[users[i]]["listings_you_have_liked"][0]["image_links"][0],
          the_listing_image_of_the_listing_they_liked:
            results[users[i]]["listings_they_have_liked"][0]["image_links"][0],
          posts: results[users[i]]["their_account_info"]["owned_listings"],
        });
      }

      setMatches(temp);
    }
    retrieveMatches();
  }, []);

  return (
    <View style={styles.container}>
      {matches == null ? (
        <Text style={{ fontFamily: "Inter", justifyContent: "center", textAlign: "center" }}>
          You have no matches. :({" "}
        </Text>
      ) : (
        matches.map(({ image, profile, posts, the_listing_image_of_the_listing_they_liked }, index) => (
          <Pressable
            style={styles.matchContainer}
            key={profile.id}
            onPress={() => {
              navigation.navigate("Match Profile", {
                profile: profile,
                posts: posts,
              });
            }}
          >
            <Image source={{ uri: String(profile.profile_pic) }} width={80} height={80} style={styles.profilePicture} />
            <Text style={styles.name}>{profile.username}</Text>
            <View styles={{ position: "relative" }} width={80} height={80}>
              <Image source={{ uri: String(image) }} width={60} height={60} style={styles.clothingPicture} />
              <Image
                source={{ uri: String(the_listing_image_of_the_listing_they_liked) }}
                width={60}
                height={60}
                style={styles.yourClothingPicture}
              />
            </View>
            <Image source={rightArrow} style={styles.rightArrow} />
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    borderBottomWidth: 1,
    borderColor: "#CECECE",
    marginHorizontal: 14,
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    width: 77,
    borderRadius: "100%",
  },
  name: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 45,
    marginLeft: 10,
    fontFamily: "Inter",
  },
  clothingPicture: {
    width: 77,
    objectFit: "contain",
    borderRadius: 10,
    marginLeft: "15%",
    postition: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  yourClothingPicture: {
    width: 77,
    objectFit: "contain",
    borderRadius: 10,
    marginLeft: "15%",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  rightArrow: {
    width: 13,
    objectFit: "contain",
    marginLeft: 20,
  },
});
