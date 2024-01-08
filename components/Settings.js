import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, Pressable, SafeAreaView, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export default function Settings() {
    return (
        <SafeAreaView>
            <View style={{display:'flex', flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Inter', fontSize: 18, marginLeft: "32%", marginTop: "2%"}}>Account Settings</Text>

            </View>
        </SafeAreaView>
    );
}