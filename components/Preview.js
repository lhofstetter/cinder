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


export default function PreviewPost() {
    const route = useRoute();

    let details = route.params;
    console.log(details);

    return (
        <View>
            <Text>Hello!</Text>
        </View>
    );
}
