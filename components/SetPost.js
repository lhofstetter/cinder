import React, { useState, useEffect } from "react";
import { Text, View, Image, Platform, TextInput, Pressable, RefreshControl } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { editStyles } from "../styles";

const styles = {
  title: {
    fontFamily: "Inter",
    fontSize: 24,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: 200,
    marginLeft: 25,
    marginTop: 20,
    bottom:-7,
  },
  titleFocus: {
    fontFamily: "Inter",
    fontSize: 24,
    borderBottomColor: "#DF85FF",
    borderBottomWidth: 1,
    width: 200,
    marginLeft: 25,
    marginTop: 20,
    bottom:-7,
  },
  postDescription: {
    backgroundColor: "#D9D9D9",
    width: "60%",
    height: 100,
    marginLeft: 150,
    borderRadius: 5,
    paddingLeft: 10,
    top: -130,
  },
  postDescriptionError: {
    backgroundColor: "#D9D9D9",
    width: "60%",
    height: 100,
    marginLeft: 150,
    borderRadius: 5,
    paddingLeft: 10,
    top: -140,
    borderColor: "#F71111",
  },
  postDescriptionFocus: {
    backgroundColor: "#D9D9D9",
    borderColor: "#DF85FF",
    width: "60%",
    height: 100,
    marginLeft: 150,
    borderRadius: 5,
    borderWidth:2,
    paddingLeft: 10,
    top: -130,
  },
  previewImageWeb: {
    display: "flex",
    marginLeft: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  previewImageMobile: {
    display: "flex",
    marginLeft: 25,
    borderRadius: 10,
    marginTop: 20,
    top:-30,
  },
  categoryListContainer: {
    borderTopColor: "#C6C6C6",
    borderTopWidth: 1,
    marginTop:-100,
  },
  categoryList: {
    width: "40%",
    display: "flex",
    marginLeft: "55%",
  },
  categoryListLabel: {
    display: "flex",
    left: 20,
    top: 27,
  },
  sizeContainer: {
    borderColor: "#C6C6C6",
    borderTopWidth: 1,
    marginTop: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  tagsContainer: {
    backgroundColor: "#D9D9D9",
    width: "90%",
    height: 100,
    borderRadius: 5,
    marginLeft: 20,
    top: 50,
    paddingLeft: 5,
  },
  previewMobile: {
    textAlign: "center",
    fontSize: 18,
    color: "#DF85FF",
  },
  previewMobileInvalid: {
    textAlign: "center",
    fontSize:18,
    color:"#D9D9D9",
  },
  priceFocus: {
    borderWidth: 2,
    borderRadius:5,
    borderColor:"#DF85FF",
    width: "20%",
    height:"8%",
    display:"flex",
    marginLeft:"70%",
    bottom:30,
  },
  priceUnfocus: {
    borderWidth: 2,
    borderRadius:5,
    borderColor:"#C6C6C6",
    width: "20%",
    height:"8%",
    display:"flex",
    marginLeft:"70%",
    bottom:30,
  }
};

const categories = [
  { key: "0", value: "Tops" },
  { key: "1", value: "Bottoms" },
  { key: "2", value: "Shoes" },
  { key: "3", value: "Accessories" },
];

const defaultSizes = [{ key: "0", value: "" }];

const topSizes = [
  { key: "0", value: "XXL" },
  { key: "1", value: "XL" },
  { key: "2", value: "L" },
  { key: "3", value: "M" },
  { key: "4", value: "S" },
  { key: "5", value: "XS" },
];

const bottomSizes = [
  { key: "0", value: "3XL" },
  { key: "1", value: "XXL" },
  { key: "2", value: "XL" },
  { key: "3", value: "L" },
  { key: "4", value: "M" },
  { key: "5", value: "S" },
  { key: "6", value: "XS" },
];

const shoeSizes = [
  { key: "0", value: "6" },
  { key: "1", value: "6.5" },
  { key: "2", value: "7" },
  { key: "3", value: "7.5" },
  { key: "4", value: "8" },
  { key: "5", value: "8.5" },
  { key: "6", value: "9" },
  { key: "7", value: "9.5" },
  { key: "8", value: "10" },
  { key: "9", value: "10.5" },
  { key: "10", value: "11" },
  { key: "11", value: "11.5" },
  { key: "12", value: "12" },
  { key: "13", value: "12.5" },
  { key: "14", value: "13" },
  { key: "15", value: "13.5" },
  { key: "15", value: "14" },
];

const accessorySize = [
  { key: "0", value: "S" },
  { key: "1", value: "M" },
  { key: "2", value: "L" },
];

function PreviewImage({ imageSrc, style }) {
  if (Platform.OS == "web") {
    return <img src={imageSrc} style={style} width={100} height={100} alt={"preview image"} />;
  } else {
    return <Image source={{ uri: imageSrc }} width={100} height={100} style={style} />;
  }
}

export default function DetailsPost() {
  const [text, setText] = useState("Write a title");
  const [description, setDescription] = useState("Type out your description!");
  const [tags, setTags] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [typeOfSize, setTypeOfSize] = useState(defaultSizes);
  const [selectedSize, setSelectedSize] = useState();
  const [currentStyle, setCurrentStyle] = useState([editStyles.title, {fontFamily: 'Inter'}]);
  const [currentPrice, setCurrentPrice] = useState("$0.00");
  const [descriptionStyle, setDescriptionStyle] = useState([editStyles.postDescription, {fontFamily: 'Inter'}]);
  const [priceBoxStyle, setPriceBoxStyle] = useState([editStyles.priceUnfocus, {fontFamily: 'Inter'}]);

  const navigation = useNavigation();
  const route = useRoute();

  let image = route.params;

  useEffect(() => {
    if (selectedType == "" || description == "Type out your description!" || description == "" || selectedSize == undefined || text == "Write a title" || text == ""){
      navigation.setOptions({headerRight: () => (
          <Text style={editStyles.previewMobileInvalid}>Continue</Text>      
      )});
    } else {
      navigation.setOptions({headerRight: () => (
        <Pressable onPress={()=> {
            navigation.navigate("Preview", {
              title:text,
              description:description,
              selectedType:selectedType,
              selectedSize:selectedSize,
              image:image,
              tags:"",
              price:currentPrice,
            });
        }}>
        <Text style={[editStyles.previewMobile, {fontFamily: "Inter"}]}>Continue</Text>
      </Pressable>
      )})
    }
  }, [text, selectedType, selectedSize, description]);

  function handleFocus () {
    if (text == "Write a title") {
      setText("");
    }
    setCurrentStyle([editStyles.titleFocus, {fontFamily: 'Inter'}]);
  }

  function handleUnfocus() {
    setCurrentStyle([editStyles.title, {fontFamily: 'Inter'}]);
  }

  function handleDescriptionFocus() {
    if (description == "Type out your description!") {
      setDescription("");
    }
    setDescriptionStyle([editStyles.postDescriptionFocus, {fontFamily: 'Inter'}]);
  }

  function handleDescriptionUnfocus() {
    setDescriptionStyle([editStyles.postDescription, {fontFamily: 'Inter'}]);
  }

  function handleChange (text) {
    setCurrentPrice(text.replace(/[^0-9.$]/g, ''))
  }

  function handlePriceFocus() {
    setPriceBoxStyle([editStyles.priceFocus, {fontFamily: 'Inter'}]);
  }
  function handlePriceUnfocus() {
    setPriceBoxStyle([editStyles.priceUnfocus, {fontFamily: 'Inter'}]);
  }
 

  function checkSelected() {
    if (selectedType == "Bottoms") {
      setTypeOfSize(bottomSizes);
    } else if (selectedType == "Shoes") {
      setTypeOfSize(shoeSizes);
    } else if (selectedType == "Accessories") {
      setTypeOfSize(accessorySize);
    } else {
      setTypeOfSize(topSizes);
    }
  }

  return (
     <View>
      <TextInput onFocus={handleFocus} onEndEditing={handleUnfocus} onChangeText={setText} value={text} style={currentStyle}></TextInput>
      <TextInput onEndEditing={handlePriceUnfocus} onFocus={handlePriceFocus} onChangeText={(text) => handleChange(text)} value={currentPrice} style={priceBoxStyle} inputMode={"decimal"}></TextInput>
      <PreviewImage imageSrc={image.image.uri} style={editStyles.previewImageMobile}/>
      <TextInput
        multiline
        onFocus={handleDescriptionFocus}
        onEndEditing={handleDescriptionUnfocus}
        onChangeText={setDescription}
        value={description}
        style={descriptionStyle}
      ></TextInput>
      <View style={editStyles.categoryListContainer}>
        <Text style={editStyles.categoryListLabel}>Clothing Type</Text>
        <SelectList
          boxStyles={editStyles.categoryList}
          onSelect={checkSelected}
          setSelected={(val) => setSelectedType(val)}
          data={categories}
          save="value"
          fontFamily={"Inter"}
        />
      </View>
      <View style={editStyles.sizeContainer}>
        <Text style={[editStyles.categoryListLabel, {fontFamily: "Inter"}]}>Size</Text>
        <SelectList fontFamily={"Inter"} boxStyles={editStyles.categoryList} setSelected={(val) => setSelectedSize(val)} data={typeOfSize} save="value"/>
      </View>
      <Text style={[editStyles.categoryListLabel, {fontFamily: "Inter"}]}>Add Tags</Text>
      <TextInput
        multiline
        onChangeText={(currentTags) => {
          setTags(currentTags);
          navigation.setOptions({
            headerRight: () => (
              <Pressable
                onPress={() => {
                  navigation.navigate("Preview", {
                    title: text,
                    description: description,
                    selectedType: selectedType,
                    selectedSize: selectedSize,
                    tags: currentTags,
                    image: image,
                  });
                }}
              >
                <Text style={[editStyles.previewMobile, {fontFamily: "Inter"}]}>Preview</Text>
              </Pressable>
            ),
          });
        }}
        value={tags}
        style={editStyles.tagsContainer}
      ></TextInput>
    </View>
  );
}

export {PreviewImage};