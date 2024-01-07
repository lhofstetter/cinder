import React, { useState, useEffect, useRef } from "react";
import { ImageBackground, Text, View, Pressable, useWindowDimensions, Platform, ActivityIndicator, Alert, Image, TextInput, Modal, ScrollView } from "react-native";
import { Svg, Path } from 'react-native-svg';
import TinderCard from "react-tinder-card";
import * as ImagePicker from "expo-image-picker";
import { exploreStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";


const alreadyRemoved = [];
const categories = ["Tops", "Bottoms", "Shoes", "Accessories"];
const validSizes = {
  "Tops": ["XS", "S", "M", "L", "XL", "XXL"],
  "Bottoms": ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  "Shoes": ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14"],
  "Accessories": ["S", "M", "L"]
}

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
  const [selectedCategories, setSelectedCategories] = useState({
    "Tops": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}],
    "Bottoms": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}],
    "Shoes": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}],
    "Accessories": [true, {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"}]
  });

  const [topSizes, setTopSizes] = useState(["XS", "XXL"]);
  const [bottomSizes, setBottomSizes] = useState(["XS", "3XL"]);
  const [shoeSizes, setShoeSizes] = useState(["6", "14"]);
  const [accessorySizes, setAccessorySizes] = useState(["S", "L"]);

  const [fetchedShoes, setFetchedShoes] = useState([]);
  const [fetchedBottoms, setFetchedBottoms] = useState([]);
  const [fetchedTops, setFetchedTops] = useState([]);
  const [fetchedAccessory, setFetchedAccessory] = useState([]);


  const getListings = async () => {
    let shoe = fetchedShoes;
    let bottom = fetchedBottoms;
    let top = fetchedTops;
    let accessory = fetchedAccessory;

    let i, min, max;
    
    min = validSizes.Shoes.indexOf(shoeSizes[0]);
    max = validSizes.Shoes.indexOf(shoeSizes[1]);
    for (i = 0; i < validSizes.Shoes.length; i++) {
      if (i >= min && i <= max) {
        if (!shoe.includes(validSizes.Shoes[i]))
          shoe.push(validSizes.Shoes[i]);
      } else {
        shoe = shoe.filter((item) => item != shoe[i]);
      } 
    }
    setFetchedShoes(shoe);

    min = validSizes.Tops.indexOf(topSizes[0]);
    max = validSizes.Tops.indexOf(topSizes[1]);
    for (i = 0; i < validSizes.Tops.length; i++) {
      if (i >= min && i <= max) {
        if (!top.includes(validSizes.Tops[i]))
          top.push(validSizes.Tops[i]);
      } else {
        top = top.filter((item) => item != top[i]);
      } 
    }
    setFetchedTops(top);

    min = validSizes.Bottoms.indexOf(bottomSizes[0]);
    max = validSizes.Bottoms.indexOf(bottomSizes[1]);
    for (i = 0; i < validSizes.Bottoms.length; i++) {
      if (i >= min && i <= max) {
        if (!bottom.includes(validSizes.Bottoms[i]))
          bottom.push(validSizes.Bottoms[i]);
      } else {
        bottom = bottom.filter((item) => item != bottom[i]);
      } 
    }
    setFetchedBottoms(bottom);

    min = validSizes.Accessories.indexOf(accessorySizes[0]);
    max = validSizes.Accessories.indexOf(accessorySizes[1]);
    for (i = 0; i < validSizes.Accessories.length; i++) {
      if (i >= min && i <= max) {
        if (!accessory.includes(validSizes.Accessories[i]))
          accessory.push(validSizes.Accessories[i]);
      } else {
        accessory = accessory.filter((item) => item != accessory[i]);
      } 
    }
    setFetchedAccessory(accessory);

    try {
      let cookie = await SecureStore.getItemAsync("cookie");
      let auth = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"));
      let size = [];
      let category = [];
      /*
      if (selectedCategories.Tops[0]) {
        for (let i = 0; i < top.length; i++) {
          if (size.indexOf(top[i]) === -1)
            size.push(top[i]);
        }
        category.push("top");
      }

      if (selectedCategories.Bottoms[0]) {
        for (let i = 0; i < bottom.length; i++) {
          if (size.indexOf(bottom[i]) === -1)
            size.push(bottom[i]);
        }
        category.push("bottom")
      }
      /*
      if (selectedCategories.Shoes[0]) {
        for (let i = 0; i < shoe.length; i++) {
          if (size.indexOf(shoe[i]) === -1)
            size.push(shoe[i]);
        }
        category.push("shoes");
      }
      
      if (selectedCategories.Accessories[0]) {
        for (let i = 0; i < accessory.length; i++) {
          if (size.indexOf(accessory[i]) === -1)
            size.push(accessory[i]);
        }
        category.push("accessory");
      }
      console.log(size, category);
      */

      let data = await fetch("https://cinder-server2.fly.dev/filtered-listings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "auth_session=" + auth,
          Origin: "https://cinder-server2.fly.dev/./",
        },
        body: JSON.stringify({
          sizes: size,
          categories: category,
          inseam_lengths: [],
          tags:[], 
          waist_sizes:[],
        }),
      });
      let formatted_data = await data.json();
      console.log(formatted_data);
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

  const handleMinChangeSizes = (size) => {
    setTopSizes([size, topSizes[1]]);
  }

  const handleMaxChangeSizes = (size) => {
    setTopSizes([topSizes[0], size]);
  }

  const handleMinChangeSizesBottoms = (size) => {
    setBottomSizes([size, bottomSizes[1]]);
  }

  const handleMaxChangeSizesBottoms = (size) => {
    setBottomSizes([bottomSizes[0], size]);
  }

  const handleMinChangeShoeSizes = (size) => {
    setShoeSizes([size, shoeSizes[1]]);
  }

  const handleMaxChangeShoesSizes = (size) => {
    setShoeSizes([shoeSizes[0], size]);
  }

  const handleMinChangeAccessorySizes = (size) => {
    setAccessorySizes([size, accessorySizes[1]]);
  }

  const handleMaxChangeAccessorySizes = (size) => {
    setAccessorySizes([accessorySizes[0], size]);
  }

  function CategoryButton ({ label }) {
    const [style, setStyle] = useState(selectedCategories[label][1]);

    return (
      <View style={style}>
        <Pressable onPress={() => {
          if (!selectedCategories[label][0]) {
            let temp = Object.create(selectedCategories);
            temp[label][0] = !selectedCategories[label][0];
            temp[label][1] = {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:"#DF85FF"};
            setSelectedCategories(temp);
            setStyle(temp[label][1]);
          } else {
            let temp = Object.create(selectedCategories);
            temp[label][0] = !selectedCategories[label][0];
            temp[label][1] = {borderStyle:"solid", borderRadius:100, borderColor:'black', borderWidth:1, display:'flex', alignItems:'center', marginLeft:"2%", backgroundColor:undefined};
            setSelectedCategories(temp);
            setStyle(temp[label][1]);
          }
        }} style={{marginLeft:"2%"}}>
            <Text style={{fontFamily: 'Inter', padding:"2%"}}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  const maxSizeRef = useRef();
  const minTopSizeRef = useRef();
  const maxSizeRefBot = useRef();
  const minBotSizeRef = useRef();
  const minShoeSizeRef = useRef();
  const maxShoeSizeRef = useRef();
  const minAccessorySizeRef = useRef();
  const maxAccessorySizeRef = useRef();

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
              <View style={{backgroundColor:'white', position:'absolute', display:'flex', flexDirection:'column', top:'20%', left:'6%', padding:20, borderRadius:20}}>
                <Text style={{fontFamily: 'Inter', marginTop:"5%"}}>Categories</Text>
                <View style={{display:'flex', flexDirection:'row', marginTop:"7%"}}>
                  {categories.map((category, index) => (
                    <CategoryButton label={category} key={index}/>
                  ))}
                </View>
                <View style={{display:"flex", flexDirection:'column', marginLeft:"5%"}}>
                  { selectedCategories['Tops'][0] ?
                  <View style={{display:"flex", flexDirection:'row'}}>
                    <Text style={{fontFamily:'Inter', marginTop:'7%', fontSize: 15}}>Top Sizes: </Text>
                    <TextInput value={topSizes[0]} onChangeText={handleMinChangeSizes} autoCapitalize="characters" ref={minTopSizeRef} onSubmitEditing={() => {
                      if (validSizes.Tops.includes(topSizes[0]))
                        minTopSizeRef.current.focus();
                      else
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          minTopSizeRef.current.focus();
                        }}]);
                    }} onEndEditing={() => {
                      if (validSizes.Tops.includes(topSizes[0]))
                        minTopSizeRef.current.focus();
                      else
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          minTopSizeRef.current.focus();
                        }}]);
                    }} enterKeyHint="next" style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} maxLength={3}/>
                    <Text style={{fontFamily:'Inter', marginTop:'5%'}}> - </Text>
                    <TextInput value={topSizes[1]} onChangeText={handleMaxChangeSizes} autoCapitalize="characters" ref={maxSizeRef} style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} enterKeyHint="done" maxLength={3} onEndEditing={() => {
                      if (!validSizes.Tops.includes(topSizes[1]))
                        Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                          maxSizeRef.current.focus();
                        }}]);
                    }} onSubmitEditing={() => {
                      if (!validSizes.Tops.includes(topSizes[1]))
                        Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                          maxSizeRef.current.focus();
                        }}]);
                    }}/>
                  </View> : <></>}
                  { selectedCategories['Bottoms'][0] ? <View style={{display:"flex", flexDirection:'row'}}>
                    <Text style={{fontFamily:'Inter', marginTop:'7%', fontSize: 15}}>Bottom Sizes: </Text>
                    <TextInput value={bottomSizes[0]} onChangeText={handleMinChangeSizesBottoms} ref={minBotSizeRef} autoCapitalize="characters" onSubmitEditing={() => {
                      if (validSizes['Bottoms'].includes(bottomSizes[0])) {
                        maxSizeRefBot.current.focus();
                      } else {
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          minBotSizeRef.current.focus();
                        }}]);
                      }
                    }} onEndEditing={() => {
                      if (validSizes['Bottoms'].includes(bottomSizes[0])) {
                        maxSizeRefBot.current.focus();
                      } else {
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          minBotSizeRef.current.focus();
                        }}]);
                      }
                    }} enterKeyHint="next" style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} maxLength={3}/>
                    <Text style={{fontFamily:'Inter', marginTop:'5%'}}> - </Text>
                    <TextInput value={bottomSizes[1]} onChangeText={handleMaxChangeSizesBottoms} autoCapitalize="characters" ref={maxSizeRefBot} style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} enterKeyHint="done" maxLength={3} 
                      onEndEditing={() => {
                        if (!validSizes['Bottoms'].includes(bottomSizes[1])) {
                          Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                            maxSizeRefBot.current.focus();
                          }}]);
                        }
                      }} onSubmitEditing={() => {
                        if (!validSizes['Bottoms'].includes(bottomSizes[1])) {
                          Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                            maxSizeRefBot.current.focus();
                          }}]);
                        }
                      }}/>
                  </View> : <></>}
                  { selectedCategories.Shoes[0] ? <View style={{display:"flex", flexDirection:'row'}}>
                  <Text style={{fontFamily:'Inter', marginTop:'7%', fontSize: 15}}>Shoe Sizes: </Text>
                    <TextInput value={shoeSizes[0]} onChangeText={handleMinChangeShoeSizes} ref={minShoeSizeRef} autoCapitalize="characters" onSubmitEditing={() => {
                      if (validSizes.Shoes.includes(shoeSizes[0])) {
                        maxShoeSizeRef.current.focus();
                      } else {
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          maxShoeSizeRef.current.focus();
                        }}]);
                      }
                    }} onEndEditing={() => {
                      if (validSizes.Shoes.includes(shoeSizes[0])) {
                        maxShoeSizeRef.current.focus();
                      } else {
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          minShoeSizeRef.current.focus();
                        }}]);
                      }
                    }} enterKeyHint="next" style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} maxLength={3}/>
                    <Text style={{fontFamily:'Inter', marginTop:'5%'}}> - </Text>
                    <TextInput value={shoeSizes[1]} onChangeText={handleMaxChangeShoesSizes} autoCapitalize="characters" ref={maxShoeSizeRef} style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} enterKeyHint="done" maxLength={3} 
                      onEndEditing={() => {
                        if (!validSizes.Shoes.includes(shoeSizes[1])) {
                          Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                            maxShoeSizeRef.current.focus();
                          }}]);
                        }
                      }} onSubmitEditing={() => {
                        if (!validSizes.Shoes.includes(shoeSizes[1])) {
                          Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                            maxShoeSizeRef.current.focus();
                          }}]);
                        }
                      }}/>
                  </View> : <></>}
                  { selectedCategories.Accessories[0] ? <View style={{display:"flex", flexDirection:'row'}}>
                  <Text style={{fontFamily:'Inter', marginTop:'7%', fontSize: 15}}>Accessory Sizes: </Text>
                    <TextInput value={accessorySizes[0]} onChangeText={handleMinChangeAccessorySizes} ref={minAccessorySizeRef} autoCapitalize="characters" onSubmitEditing={() => {
                      if (validSizes.Accessories.includes(accessorySizes[0])) {
                        maxAccessorySizeRef.current.focus();
                      } else {
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          maxAccessorySizeRef.current.focus();
                        }}]);
                      }
                    }} onEndEditing={() => {
                      if (validSizes.Accessories.includes(accessorySizes[0])) {
                        maxAccessorySizeRef.current.focus();
                      } else {
                        Alert.alert("Invalid size", "Please enter a valid minimum size!", [{text: "Ok", onPress: () => {
                          minAccessorySizeRef.current.focus();
                        }}]);
                      }
                    }} enterKeyHint="next" style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} maxLength={3}/>
                    <Text style={{fontFamily:'Inter', marginTop:'5%'}}> - </Text>
                    <TextInput value={accessorySizes[1]} onChangeText={handleMaxChangeAccessorySizes} autoCapitalize="characters" ref={maxAccessorySizeRef} style={{marginTop:'5%', borderWidth:1, padding: 5, borderRadius:5}} enterKeyHint="done" maxLength={3} 
                      onEndEditing={() => {
                        if (!validSizes.Accessories.includes(accessorySizes[1])) {
                          Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                            maxAccessorySizeRef.current.focus();
                          }}]);
                        }
                      }} onSubmitEditing={() => {
                        if (!validSizes.Accessories.includes(accessorySizes[1])) {
                          Alert.alert("Invalid size", "Please enter a valid maximum size!", [{text: "Ok", onPress: () => {
                            maxAccessorySizeRef.current.focus();
                          }}]);
                        }
                      }}/>
                  </View> : <></>}
                </View>
                <Pressable onPress={() => {
                    if (validSizes['Bottoms'].includes(bottomSizes[0]) && validSizes['Bottoms'].includes(bottomSizes[1])&& validSizes['Tops'].includes(topSizes[0]) && validSizes['Tops'].includes(topSizes[1]) && validSizes.Shoes.includes(shoeSizes[0]) && validSizes.Shoes.includes(shoeSizes[1]) && validSizes.Accessories.includes(accessorySizes[0]) && validSizes.Accessories.includes(accessorySizes[1]))
                      setSettings({visible: false});
                    else {
                      Alert.alert("Invalid settings :(", "It looks like one of the sizes you entered isn't valid. Please double-check your filters and try again.");
                    }

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
