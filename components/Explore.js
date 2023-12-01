import React, { useState, useMemo, useEffect } from "react";
import {
  ImageBackground,
  Text,
  View,
  Image,
  Pressable,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import TinderCard from "react-tinder-card";
import * as ImagePicker from "expo-image-picker";
import { exploreStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

const logo = require("../assets/cindr.png");

const alreadyRemoved = [];

const SwipeableCard = ({ character, index, swiped, outOfFrame }) => {
  const [color, setColor] = useState([null, 1.0, "#fff", ""]);
  const { width, height } = useWindowDimensions();

  return (
    <Pressable
      onTouchStart={(event) => {
        setColor([[event.nativeEvent.pageX, event.nativeEvent.pageY], 1.0, "#fff", ""]);
      }}
      onTouchMove={(event) => {
        if (color[0] != null) {
          if (event.nativeEvent.pageX - color[0][0] > 0) {
            // moving to the right
            let xRatio;

            xRatio = event.nativeEvent.pageX / width;
            setColor([color[0], 1.0 - xRatio, "#00FF00", "Slay"]);
          } else if (event.nativeEvent.pageX - color[0][0] < -50) {
            let xRatio;

            xRatio = 1 / (event.nativeEvent.pageX / (width / 16));
            setColor([color[0], 1.0 - xRatio, "#FF0000", "Nay"]);
          } else {
            setColor([color[0], 1.0, "#fff", ""]);
          }
        }
      }}
      onMouseMove={(event) => {
        if (color[0] != null) {
          if (event.nativeEvent.pageX - color[0][0] > 100) {
            // moving to the right
            let xRatio;

            xRatio = (event.nativeEvent.pageX + 100) / width;
            setColor([color[0], 1.0 - xRatio, "#00FF00", "Slay"]);
          } else if (event.nativeEvent.pageX - color[0][0] < -100) {
            // moving to the left
            let xRatio;

            xRatio = 1 / (event.nativeEvent.pageX / (width / 8));
            if (xRatio == Infinity)
              // fixes a bug where somehow the above calculation tends toward infinity
              xRatio = 1.0;
            setColor([color[0], 1.0 - xRatio, "#FF0000", "Nay"]);
          } else {
            setColor([color[0], 1.0, "#fff", ""]);
          }
        }
      }}
      onPressIn={(event) => {
        setColor([[event.nativeEvent.pageX, event.nativeEvent.pageY], 1.0, "#fff", ""]);
      }}
      onTouchEnd={() => {
        setColor([null, 1.0, "#fff", ""]);
      }}
      onPressOut={() => {
        setColor([null, 1.0, "#fff", ""]);
      }}
    >
      <TinderCard
        onSwipe={(dir) => swiped(dir, character.listing_name.replace(" ", "_"), character.id)}
        onCardLeftScreen={() => outOfFrame(character.listing_name)}
        preventSwipe={["up", "down"]}
      >
        {Platform.OS == "web" ? (
          <View style={[exploreStyles.cardWeb, { backgroundColor: color[2] }]}>
            <ImageBackground
              style={[exploreStyles.cardImageWeb, { opacity: color[1] }]}
              source={character.image_links[0]}
            >
              <Text style={exploreStyles.cardTitle}>{character.listing_name}</Text>
              <Text style={exploreStyles.likeOrDislikeText}>{color[3]}</Text>
            </ImageBackground>
          </View>
        ) : (
          <View style={[exploreStyles.cardMobile, { backgroundColor: color[2] }]}>
            <Text style={exploreStyles.likeOrDislikeText}>{color[3]}</Text>
            <ImageBackground
              style={[exploreStyles.cardImageMobile, { opacity: color[1] }]}
              source={{ uri: character.image_links[0] }}
            >
              <Text style={exploreStyles.cardTitle}>{character.listing_name}</Text>
            </ImageBackground>
          </View>
        )}
      </TinderCard>
    </Pressable>
  );
};

const Advanced = () => {
  const [characters, setCharacters] = useState([]);
  const [lastDirection, setLastDirection] = useState();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [begin, setBegin] = useState(0);
  const [refresh, setRefresh] = useState(1);
  const [actualRefresh, setActualRefresh] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const getListings = async () => {
      let temp = characters;
      let i = begin;
      while (temp.length < 5 && i - begin < 15) {
        await fetch("https://cinder-server2.fly.dev/listing/" + String(i)).then(async (data) => {
          if (data.ok) {
            data = await data.json();
            data["id"] = i;
            temp.unshift(data);
          }
          i++;
        });
      }
      setCharacters(temp);
      setBegin(i);
      setActualRefresh(false);
    };

    if (actualRefresh) getListings();
  }, []);

  const swiped = async (direction, nameToDelete, id) => {
    setLastDirection(direction);
    let cookie = await SecureStore.getItemAsync("cookie");
    let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));

    if (direction == "right") {
      await fetch("https://cinder-server2.fly.dev/match/like/" + String(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "auth_session=" + auth,
          Origin: "https://cinder-server2.fly.dev/./",
        },
      });
    } else {
      await fetch("https://cinder-server2.fly.dev/match/dislike/" + String(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "auth_session=" + auth,
          Origin: "https://cinder-server2.fly.dev/./",
        },
      });
    }

    if (refresh % 5 == 0) {
      setRefresh(refresh + 1);
      setActualRefresh(true);
    } else {
      setRefresh(refresh + 1);
    }
  };

  const outOfFrame = (id) => {
    let temp = characters;
    temp = temp.filter((character) => character.id !== id);
    alreadyRemoved.push(id);
    setCharacters(temp);
  };

  return (
    <View style={exploreStyles.container}>
      <Text style={exploreStyles.mobileHeader}>cindr_</Text>
      {characters.length === alreadyRemoved.length ? (
        actualRefresh ? (
          <View style={exploreStyles.loading}>
            <ActivityIndicator size="large" />
            <Text style={exploreStyles.loadingText}>Hang on, we're getting some drip ready for you!</Text>
          </View>
        ) : (
          <View style={exploreStyles.emptyCardContainer}>
            <Text style={[exploreStyles.emptyCardTitle, { fontFamily: "Inter" }]}>
              No more listings are available right now. Please try again later.
            </Text>
          </View>
        )
      ) : (
        <View style={exploreStyles.cardContainer}>
          {characters.map((character, index) => (
            <SwipeableCard character={character} index={index} key={index} swiped={swiped} outOfFrame={outOfFrame} />
          ))}
        </View>
      )}
    </View>
  );
};

export default Advanced;
