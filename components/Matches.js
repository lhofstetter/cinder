import React, { useState, useEffect } from "react";
import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const matchedClothing = require("../assets/clothing0.png");
const samplepfp = require("../assets/samplepfp.png");
const rightArrow = require("../assets/right_arrow.png")


export default function Matches() {
    return (
        <View style={styles.container}>
            <Pressable style={styles.matchContainer}>
                <View style={styles.innerContainer} >
                    <Image source={samplepfp} style={styles.profilePicture}/>
                    <Text style={styles.name}>
                        Sammy
                    </Text>
                </View>
                <View style={styles.innerContainer} >
                    <Image source={matchedClothing} style={styles.clothingPicture}/>
                    <Image source={rightArrow} style={styles.rightArrow}/>
                </View>
            </Pressable>
            <Pressable style={styles.matchContainer}>
                <View style={styles.innerContainer} >
                    <Image source={samplepfp} style={styles.profilePicture}/>
                    <Text style={styles.name}>
                        Sammy
                    </Text>
                </View>
                <View style={styles.innerContainer} >
                    <Image source={matchedClothing} style={styles.clothingPicture}/>
                    <Image source={rightArrow} style={styles.rightArrow}/>
                </View>
            </Pressable>
        </View>
    );

    
}

const styles = StyleSheet.create({
    container: {

    },
    matchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 100,
        borderBottomWidth: 1,
        borderColor: "#CECECE",
        marginHorizontal: 14

    },

    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"

    },
    profilePicture: {
        width: 77,
        objectFit: "contain",
    },
    name:{
        fontWeight: "600",
        fontSize: 20,
        marginBottom: 45,
        marginLeft: 10
    },
    clothingPicture: {
        width: 77,
        objectFit: "contain"
    },
    rightArrow: {
        width: 13,
        objectFit: "contain",
        marginLeft: 20
    }
})