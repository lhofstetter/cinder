import React, { useState, useMemo, useEffect } from "react";
import { ImageBackground, Text, View, Image, Pressable, useWindowDimensions, Platform } from "react-native";
import TinderCard from "react-tinder-card";
import * as ImagePicker from 'expo-image-picker';
import { exploreStyles } from "../styles";
import * as SecureStore from 'expo-secure-store';

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
        preventSwipe={['up', 'down']}
      >
        {Platform.OS == "web" ? (
          <View style={[exploreStyles.cardWeb, { backgroundColor: color[2] }]}>
            <ImageBackground style={[exploreStyles.cardImageWeb, { opacity: color[1] }]} source={character.image_links[0]}>
              <Text style={exploreStyles.cardTitle}>{character.listing_name}</Text>
              <Text style={exploreStyles.likeOrDislikeText}>{color[3]}</Text>
            </ImageBackground>
          </View>
        ) : (
          <View style={[exploreStyles.cardMobile, { backgroundColor: color[2] }]}>
            <Text style={exploreStyles.likeOrDislikeText}>{color[3]}</Text>
            <ImageBackground style={[exploreStyles.cardImageMobile, { opacity: color[1] }]} source={{uri:character.image_links[0]}}>
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
  const [begin, setBegin] = useState(1);
  
  
  useEffect(() => {
    const getListings = async () => {
      let temp = characters;
      for (let i = begin; i <= begin + 5; i++) {
        let data = await fetch ("https://cinder-server2.fly.dev/listing/" + String(i)).then((data) => data.json()).then((formatted) => {
          return formatted;
        });
        if ("error" in data) {
          continue;
        }
        data['id'] = i;
        temp.unshift(data);
      }
      setCharacters(temp);
      setBegin(begin + 1);
    };
    getListings();
  }, [characters]);


  const swiped = async (direction, nameToDelete, id) => {
    setLastDirection(direction);
    let cookie = await SecureStore.getItemAsync("cookie");
    let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));

    if (direction == 'right') {
      await fetch("https://cinder-server2.fly.dev/match/like/" + String(id), {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth_session=' + auth,
          'Origin': 'https://cinder-server2.fly.dev/./'
        }
      })
    } else {
      await fetch("https://cinder-server2.fly.dev/match/dislike/" + String(id), {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth_session=' + auth,
          'Origin': 'https://cinder-server2.fly.dev/./'
        }
      })
    }
    
    alreadyRemoved.push(nameToDelete);
  };

  const outOfFrame = (name) => {
    let temp = characters;
    temp = temp.filter((character) => character.listing_name !== name);
    setCharacters(temp);
  };

  return (
    <View style={exploreStyles.container}>
      <Image source={logo} style={exploreStyles.mobileHeader} />
    {characters.length === 0 ? <View style={exploreStyles.emptyCardContainer}><Text style={[exploreStyles.emptyCardTitle, {fontFamily: 'Inter'}]}>No more listings are available right now. Please try again later.</Text></View> : <View style={exploreStyles.cardContainer}>
        {characters.map((character, index) => (
          <SwipeableCard
            character={character}
            index={index}
            key={index}
            swiped={swiped}
            outOfFrame={outOfFrame}
          />
        ))}
      </View>}
    </View>
  );
};

export default Advanced;
