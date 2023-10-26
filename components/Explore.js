import React, { useState, useMemo } from "react";
import {
  ImageBackground,
  Text,
  View,
  Button,
  Pressable,
  useWindowDimensions,
} from "react-native";
import TinderCard from "react-tinder-card";

let styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  header: {
    color: "#000",
    fontSize: 30,
    marginBottom: 30,
  },
  cardContainer: {
    width: "90%",
    maxWidth: 260,
    height: 300,
    marginBottom: 100,
  },
  card: {
    position: "absolute",
    width: "100%",
    maxWidth: 400,
    height: 400,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: "cover",
    zIndex: -100,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  cardTitle: {
    position: "absolute",
    bottom: 0,
    margin: 10,
    color: "#fff",
  },
  buttons: {
    margin: 20,
    zIndex: -100,
  },
  infoText: {
    height: 28,
    paddingTop: 30,
    justifyContent: "center",
    display: "flex",
    zIndex: -100,
  },
  likeOrDislikeText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 30,
    marginTop: 175,
    position: "relative",
    zIndex: 100,
  },
};
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
    name: "Dark Jeans, barely worn",
    categories: ["jeans", "dark", "cotton"],
    tags: ["like new"],
    price: 12,
    swapCompatible: true,
    img: require("../assets/download.jpeg"),
  },
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
    name: "Dinesh Chugtai",
    img: require("../assets/pic5.jpeg"),
  },
];

const alreadyRemoved = [];
let charactersState = db; // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.

const Advanced = ({ navigation }) => {
  const [characters, setCharacters] = useState(db);
  const [lastDirection, setLastDirection] = useState();
  const [color, setColor] = useState([null, 1.0, "#fff", ""]);
  const { height, width } = useWindowDimensions();

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
    charactersState = charactersState.filter(
      (character) => character.name !== name,
    );
    setCharacters(charactersState);
  };

  const swipe = (dir) => {
    const cardsLeft = characters.filter(
      (person) => !alreadyRemoved.includes(person.name),
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name; // Find the card object to be removed
      const index = db.map((person) => person.name).indexOf(toBeRemoved); // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cinder</Text>
      <View style={styles.cardContainer}>
        {characters.map((character, index) => (
          <Pressable
            key={character.name}
            ref={childRefs[index]}
            onTouchStart={(event) => {
              setColor([
                [event.nativeEvent.pageX, event.nativeEvent.pageY],
                1.0,
                "#fff",
                "",
              ]);
            }}
            onTouchMove={(event) => {
              if (color[0] != null) {
                if (event.nativeEvent.pageX - color[0][0] > 50) {
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

                  xRatio = (event.nativeEvent.pageX - 100) / width;
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
              setColor([
                [event.nativeEvent.pageX, event.nativeEvent.pageY],
                1.0,
                "#fff",
                "",
              ]);
            }}
            onTouchEnd={() => {
              setColor([null, 1.0, "#fff", ""]);
            }}
            onPressOut={() => {
              setColor([null, 1.0, "#fff", ""]);
            }}
          >
            <TinderCard
              ref={childRefs[index]}
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name)}
              onCardLeftScreen={() => outOfFrame(character.name)}
            >
              <View style={[styles.card, { backgroundColor: color[2] }]}>
                <ImageBackground
                  style={[styles.cardImage, { opacity: color[1] }]}
                  source={character.img}
                >
                  <Text style={styles.cardTitle}>{character.name}</Text>
                  <Text style={styles.likeOrDislikeText}>{color[3]}</Text>
                </ImageBackground>
              </View>
            </TinderCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Advanced;
