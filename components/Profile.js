import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { PreviewImage } from "./SetPost";
import { profileStyles } from "../styles";

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
  const [user, setUser] = useState({
    name: "Bobby B.",
    picture: samplepfp,
    year: "2024",
    rating: 3.6,
    ratings: 18,
    bio: "help me give my awesome clothes a new home! looking for over-sized sweaters",
    listings: images,
  });

  const [listings, setListings] = useState();

  const retrieveListings = async () => {
    let posts = [];
  
    for (let i = 0; i < user.listings.length; i++) {
      await fetch("http://localhost:3000/listing/" + user.listings[i]).then((data) => {
        posts.push(data);
      });
    }

    setListings(posts);
  }

  useEffect(() => {
    retrieveListings();
  }, []);
  

  // stars round up no half stars right now
  let stars = [];
  for (let i = 0; i < 5; i++) {
    let src = emptyStar;
    if (user.rating >= i + 0.5) src = star;

    stars[i] = (
      <Image
        source={src}
        style={profileStyles.star}
      ></Image>
    );
  }

  //images to be replaced with listing component probably
  const displayListings = user.listings.map((image) => {
    return (
      <Image
        style={profileStyles.listing}
        source={image}
      ></Image>
    );
  });

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
            source={user.picture}
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
            <View
              style={profileStyles.starContainer}
            >
              {stars}
              <Text
                style={profileStyles.numOfRatings}
              >
                {" "}
                ({user.ratings}){" "}
              </Text>
            </View>
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
        {/* imgs */}

        {displayListings}
      </View>
    </ScrollView>
  );
}
