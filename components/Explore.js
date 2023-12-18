import React, { useState, useEffect, useRef } from "react";
import { ImageBackground, Text, View, Pressable, useWindowDimensions, Platform, ActivityIndicator, Alert, Image, TextInput, Modal, ScrollView } from "react-native";
import { Svg, Path } from 'react-native-svg';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import TinderCard from "react-tinder-card";
import * as ImagePicker from "expo-image-picker";
import { exploreStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";


const alreadyRemoved = [];
const categories = ["Tops", "Bottoms", "Shoes", "Accessories"];

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
              <Text style={{ shadowOpacity: 1, shadowRadius: 6 }}>{character.size}</Text>
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
  const [refresh, setRefresh] = useState(1);
  const [actualRefresh, setActualRefresh] = useState(true);
  const [settings, setSettings] = useState({visible: false});
  const [pressed, setPressed] = useState(false);
  const [state, setState] = useState({ scrollEnabled: false});
  const [selectedCategories, setSelectedCategories] = useState({
    "Tops": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}],
    "Bottoms": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}],
    "Shoes": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}],
    "Accessories": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}]
  });
  const [modalPressed, setModalPressed] = useState(false);
  const [sizes, setSizes] = useState({
    "Tops": {min: 1, max: 6, "numericalRange": [1, 6], "correspondingValues": ["XS", "S", "M", "L", "XL", "XXL"]},
    "Bottoms": {min: 1, max: 7, "numericalRange": [1, 7], "correspondingValues": ["XS", "S", "M", "L", "XL", "XXL", "3XL"]},
    "Shoes": {min: 1, max: 17, "numericalRange": [1, 17], "correspondingValues": ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14"]},
    "Accessories": {min: 1, max: 3, "numericalRange": [1, 3], "correspondingValues": ["S", "M", "L"]},
  });

  const navigation = useNavigation();
  const enableScroll = () => setState({ scrollEnabled: true });
  const disableScroll = () => setState({ scrollEnabled: false });

  const getListings = async () => {
    try {
      let cookie = await SecureStore.getItemAsync("cookie");
      let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));

      let data = await fetch("https://cinder-server2.fly.dev/filtered-listings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "auth_session=" + auth,
          Origin: "https://cinder-server2.fly.dev/./",
        },
        body: JSON.stringify({
          sizes: [],
          categories: [],
          inseam_lengths: [],
          tags:[], 
          waist_sizes:[],
        }),
      });

      let formatted_data = await data.json();
      setCharacters(formatted_data);
    } catch (error) {
      console.log(error);
    } finally {
      setActualRefresh(false);
    }
  };

  useEffect(() => {
    if (actualRefresh) getListings();
  }, []);

  
  const modalRef = useRef();

  const swiped = async (direction, nameToDelete, id) => {
    setLastDirection(direction);
    let cookie = await SecureStore.getItemAsync("cookie");
    let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));

    if (direction == "right") {
      const response = await fetch("https://cinder-server2.fly.dev/match/like/" + String(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "auth_session=" + auth,
          Origin: "https://cinder-server2.fly.dev/./",
        },
      });
      const data = await response.json();
      if (data?.matches) {
        const {data: listingData} = await axios.get(`https://cinder-server2.fly.dev/listing/${id}`);
        Alert.alert(`You matched with the owner of "${listingData.listing_name}"! Shoot them a message and coordinate a swap!"`)
      }
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

  function CategoryButton ({ label }) {
    const [style, setStyle] = useState(selectedCategories[label][1]);

    return (
      <View style={style}>
        <Pressable onPress={() => {
          if (!selectedCategories[label][0]) {
            selectedCategories[label][0] = !selectedCategories[label][0];
            selectedCategories[label][1] = {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"};
            setSelectedCategories(selectedCategories);
            setStyle(selectedCategories[label][1]);
          } else {
            selectedCategories[label][0] = !selectedCategories[label][0];
            selectedCategories[label][1] = {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:undefined};
            setSelectedCategories(selectedCategories);
            setStyle(selectedCategories[label][1]);
          }
        }} style={{marginLeft:"2%"}}>
            <Text style={{fontFamily: 'Inter', padding:"2%"}}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={exploreStyles.container}>
      <View style={{display:'flex', flexDirection:'row'}}>
        <Text style={exploreStyles.mobileHeader}>cindr_</Text>
        <Pressable onPress={() => {
            setSettings({visible:true});
        }} style={{display:'flex', left: "160%", top:"2.5%"}}>
          <Svg xmlns="http://www.w3.org/2000/svg" height={30} viewBox="0 -960 960 960" width={30}>
            <Path
              d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
              fill="black" 
            />
          </Svg>
        </Pressable>
        </View>
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
        <View>
            
            <Modal
              visible={settings.visible}
              transparent={true}
              animationType="slide"
              ref={modalRef}
            >
              <View style={{backgroundColor:'white', position:'absolute', display:'flex', flexDirection:'column', top:'30%', left:'6%', padding:20, borderRadius:20}}>
                <Text style={{fontFamily: 'Inter', marginTop:"5%"}}>Categories</Text>
                <View style={{display:'flex', flexDirection:'row', marginTop:"7%"}}>
                  {categories.map((category, index) => (
                    <CategoryButton label={category} key={index}/>
                  ))}
                </View>
                <View style={{display:'flex', flexDirection:'row'}}>
                  <Pressable onPress={() => {
                    setPressed(false);
                  }} style={{display: 'flex', flexDirection:"row", marginTop: '10%'}}>

                    { !pressed ? <Svg xmlns="http://www.w3.org/2000/svg" height={30} viewBox="0 -960 960 960" width={30}>
                          <Path
                            d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                            fill="black" 
                          />
                        </Svg> : <Svg xmlns="http://www.w3.org/2000/svg" height={30} viewBox="0 -960 960 960" width={30}>
                          <Path
                            d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                            fill="black" 
                          />
                        </Svg>}
                    <Text style={{fontFamily: 'Inter', marginLeft: '7%', marginTop: '4%'}}>One Size</Text>
                  </Pressable>
                  <Pressable onPress={() => {
                    setPressed(true);
                    setSelectedCategories(selectedCategories);
                  }} style={{display: 'flex', flexDirection:'row', marginTop: '9.2%'}}>
                    { pressed ? <Svg xmlns="http://www.w3.org/2000/svg" height={30} viewBox="0 -960 960 960" width={30}>
                        <Path
                          d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                          fill="black" 
                        />
                      </Svg> : <Svg xmlns="http://www.w3.org/2000/svg" height={30} viewBox="0 -960 960 960" width={30}>
                          <Path
                            d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                            fill="black" 
                          />
                        </Svg>}
                    <Text style={{fontFamily: 'Inter', marginLeft: '7%', marginTop: '5%'}}>Many Sizes</Text>
                  </Pressable>
                </View>
                <View style={{display:"flex", flexDirection:'column'}}>
                  {selectedCategories.Tops[0]}
                  {selectedCategories.Tops[0] && pressed ? <MultiSlider
                          onValuesChangeStart={disableScroll}
                          onValuesChangeFinish={enableScroll}
                          values={sizes.Tops.numericalRange}
                          onValuesChange={(newValues) => {
                            sizes.Tops.numericalRange = newValues;
                            setSizes(sizes);
                          }}
                          smoothSnapped={true}
                          step={1}
                          min={sizes.Tops.min}
                          max={sizes.Tops.max - 1}
                          enableLabel={true}
                          showSteps={true}
                          showStepsLabels={true}
                          selectedStyle={{backgroundColor: "#DF85FF"}}
                          customLabel={() => (
                            <View style={{marginTop:"5%", marginLeft:"2%", display:"flex", flexDirection:"row"}}><Text style={{fontFamily: "Inter"}}>Top Sizes: {sizes.Tops.correspondingValues[sizes.Tops.numericalRange[0]]} - {sizes.Tops.correspondingValues[sizes.Tops.numericalRange[1]]}</Text></View>
                          )}
                          stepsAs={[{
                            index:0,
                            stepLabel: "XS",
                          }, {
                            index:sizes.Tops.max - 1,
                            stepLabel: "XXL",
                          }]}
                          />: <></>}
                </View>
                <Pressable onPress={() => {
                    setSettings({visible: false});
                }} style={{marginLeft: "25%", borderColor:"#DF85FF", backgroundColor:"#DF85FF", borderWidth:1, width:"50%", borderRadius: 20, marginTop:"5%", display:"flex", alignItems:"center", alignContent:"center" }}>
                  <Text style={{color:"white", paddingTop:"5%", paddingBottom:"5%"}}>Save</Text>
                </Pressable>
                </View>
                
            </Modal>
          </View>
    </View>
  );
};

export default Advanced;
