import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Platform,
  TextInput,
  Pressable
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

const styles = {
    postMobile: {
        textAlign: "center",
        fontSize:18,
        color:"#DF85FF",
    },
    postMobileTitles: {
        paddingTop:"3%",
        paddingLeft:"4%",
    },
    postMobileTitle: {
        fontWeight: "bold",
        fontSize: 20,
    },
    postMobileSubtitle: {
        fontSize: 16,
        color: "#6C6C6C",
    },
    seperator: {
        borderBottomWidth: 1,
        paddingTop:"4%",
        width: "90%",
        marginLeft: "5%",
        borderBottomColor: "#B5B5B5",
    },
    profile: {
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: "5%",
        paddingLeft:"6%",
    },
    postTextContainer: {
        fontSize:14,
        paddingTop:"10%",
        paddingLeft:"6%",
    },
    postDescription: {
        color:"#000000",
    },
    postTags: {
        paddingTop:"4%",
        color:"#DF85FF",
    }
};




export default function PreviewPost() {
    const route = useRoute();
    const navigation = useNavigation();
    const [fontLoaded, setFontLoaded] = useState(false);

    let details = route.params;

    useEffect(() => {
        navigation.setOptions({headerRight: () => (
          <Pressable onPress={()=> {
            
            navigation.navigate("Swipe");
          }}>
          <Text style={styles.postMobile}>Post</Text>
        </Pressable>
        )})
        async function loadFont() {
          await Font.loadAsync({
            Inter: require("../assets/fonts/static/Inter-Medium.ttf"),
          });
    
          setFontLoaded(true);
        }
    
        loadFont();
      }, []);
    
    let preTags = details.tags.split(",");
    let tags = "";
    
    for (let i = 0; i < preTags.length; i++) {
        while (preTags[i].indexOf(" ") != -1) {
            preTags[i] = preTags[i].replace(" ", "");
        }
        tags += ("#" + preTags[i] + " ");
    }
    return (
        <View>
            <Image source={{uri: details.image.image}} style={{width:500, height:500}}/>
            <View style={styles.postMobileTitles}>
                <Text style={styles.postMobileTitle}>{details.title}</Text>
                <Text style={styles.postMobileSubtitle}>Size {details.selectedSize} • {details.selectedType}</Text>
            </View>
            <View style={styles.seperator}/>
            <View style={styles.profile}>

            </View>
            <View style={styles.postTextContainer}>
                <Text style={styles.postDescription}>{details.description}</Text>
                <Text style={styles.postTags}>{tags}</Text>
            </View>
        </View>
    );
}
