import React, { useState, useMemo, useEffect } from "react";
import { ImageBackground, Text, View, Image, Pressable, useWindowDimensions, Platform } from "react-native";
import TinderCard from "react-tinder-card";
import * as ImagePicker from 'expo-image-picker';
import { exploreStyles } from "../styles";
import { useRoute, useNavigation } from "@react-navigation/native";

const logo = require("../assets/cindr.png");

/*
    P(L) = P(M) * P(C) * P(T)
    where P(L) = Probability of user liking clothing,
    P(M) = Probability of it being in the users price range
    P(C) = Probability of it being a category the user has liked in the past,
    P(T) = Probability of it being tagged with similar tags the user has liked
    

    item
    {
        "listing_name": String,
        "id": (32-bit Unique) AlphaNumeric String
        "price": Number,
        "categories": Array of Strings, each containing a category name
        "tags": Array of Strings, each containing a tag name
        "swap-compatible": Boolean
    }

    user
*/

const db = [
  {
    name: "Erlich Bachman",
    img: require("../assets/pic2.jpeg"),
  },
  {
    name: "Monica Hall",
    img: require("../assets/pic3.jpeg"),
  },
  {
    name: "Jared Dunn",
    img: require("../assets/pic4.jpeg"),
  },
  {
    name: "Dark Jeans, barely worn",
    categories: ["jeans", "dark", "cotton"],
    tags: ["like new"],
    price: 12,
    swapCompatible: true,
    img: require("../assets/download.png"),
  },
];

const alreadyRemoved = [];
let charactersState = db; // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.

const SwipeableCard = ({ character, index, childRef, swiped, outOfFrame }) => {
  const [color, setColor] = useState([null, 1.0, "#fff", ""]);
  const { width, height } = useWindowDimensions();

  return (
    <Pressable
      key={character.name}
      ref={childRef}
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
        ref={childRef}
        key={character.name}
        onSwipe={(dir) => swiped(dir, character.name)}
        onCardLeftScreen={() => outOfFrame(character.name)}
        preventSwipe={['up', 'down']}
      >
        {Platform.OS == "web" ? (
          <View style={[exploreStyles.cardWeb, { backgroundColor: color[2] }]}>
            <ImageBackground style={[exploreStyles.cardImageWeb, { opacity: color[1] }]} source={character.img}>
              <Text style={exploreStyles.cardTitle}>{character.name}</Text>
              <Text style={exploreStyles.likeOrDislikeText}>{color[3]}</Text>
            </ImageBackground>
          </View>
        ) : (
          <View style={[exploreStyles.cardMobile, { backgroundColor: color[2] }]}>
            <Text style={exploreStyles.likeOrDislikeText}>{color[3]}</Text>
            <ImageBackground style={[exploreStyles.cardImageMobile, { opacity: color[1] }]} source={character.img}>
              <Text style={exploreStyles.cardTitle}>{character.name}</Text>
            </ImageBackground>
          </View>
        )}
      </TinderCard>
    </Pressable>
  );
};

const Advanced = () => {
  const [characters, setCharacters] = useState(db);
  const [lastDirection, setLastDirection] = useState();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    [],
  );

  const swiped = (direction, nameToDelete) => {
    setLastDirection(direction);
    alreadyRemoved.push(nameToDelete);
  };

  const outOfFrame = (name) => {
    charactersState = charactersState.filter((character) => character.name !== name);
    setCharacters(charactersState);
  };

  const swipe = (dir) => {
    const cardsLeft = characters.filter((person) => !alreadyRemoved.includes(person.name));
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name; // Find the card object to be removed
      const index = db.map((person) => person.name).indexOf(toBeRemoved); // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };
  return (
    <View style={exploreStyles.container}>
      {Platform.OS == "web" ? (
        <img src={logo} style={exploreStyles.webHeader} alt={"logo"} />
      ) : (
        <Image source={logo} style={exploreStyles.mobileHeader} />
      )}
      <View style={exploreStyles.cardContainer}>
        {characters.map((character, index) => (
          <SwipeableCard
            key={character.name}
            character={character}
            index={index}
            childRef={childRefs[index]}
            swiped={swiped}
            outOfFrame={outOfFrame}
          />
        ))}
      </View>
    </View>
  );
};

export default Advanced;
