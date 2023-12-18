import React, { useState, useEffect } from "react";
import { Text, View, Image, Platform, TextInput, Pressable, RefreshControl } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { editStyles } from "../styles";

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
  { key: "16", value: "14" },
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
  const [currentStyle, setCurrentStyle] = useState([editStyles.title, { fontFamily: "Inter" }]);
  const [descriptionStyle, setDescriptionStyle] = useState([editStyles.postDescription, { fontFamily: "Inter" }]);

  const navigation = useNavigation();
  const route = useRoute();

  let image = route.params;
  console.log(image);

  useEffect(() => {
    if (
      selectedType == "" ||
      description == "Type out your description!" ||
      description == "" ||
      selectedSize == undefined ||
      text == "Write a title" ||
      text == ""
    ) {
      navigation.setOptions({ headerRight: () => <Text style={editStyles.previewMobileInvalid}>Continue</Text> });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <Pressable
            onPress={() => {
              navigation.navigate("Preview", {
                title: text,
                description: description,
                selectedType: selectedType,
                selectedSize: selectedSize,
                image: image,
                tags: "",
              });
            }}
          >
            <Text style={[editStyles.previewMobile, { fontFamily: "Inter" }]}>Continue</Text>
          </Pressable>
        ),
      });
    }
  }, [text, selectedType, selectedSize, description]);

  function handleFocus() {
    if (text == "Write a title") {
      setText("");
    }
    setCurrentStyle([editStyles.titleFocus, { fontFamily: "Inter" }]);
  }

  function handleUnfocus() {
    setCurrentStyle([editStyles.title, { fontFamily: "Inter" }]);
  }

  function handleDescriptionFocus() {
    if (description == "Type out your description!") {
      setDescription("");
    }
    setDescriptionStyle([editStyles.postDescriptionFocus, { fontFamily: "Inter" }]);
  }

  function handleDescriptionUnfocus() {
    setDescriptionStyle([editStyles.postDescription, { fontFamily: "Inter" }]);
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
      <TextInput
        onFocus={handleFocus}
        onEndEditing={handleUnfocus}
        onChangeText={setText}
        value={text}
        style={currentStyle}
      ></TextInput>
      <PreviewImage imageSrc={image.images[0].uri} style={editStyles.previewImageMobile} />
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
        <Text style={[editStyles.categoryListLabel, { fontFamily: "Inter" }]}>Size</Text>
        <SelectList
          fontFamily={"Inter"}
          boxStyles={editStyles.categoryList}
          setSelected={(val) => setSelectedSize(val)}
          data={typeOfSize}
          save="value"
        />
      </View>
      <Text style={[editStyles.categoryListLabel, { fontFamily: "Inter" }]}>Add Tags</Text>
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
                <Text style={[editStyles.previewMobile, { fontFamily: "Inter" }]}>Preview</Text>
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

export { PreviewImage };
