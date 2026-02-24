import React from "react";
import {Text, View } from "react-native";

export default function Settings() {
  return (
      <View style={{display: "flex", flexDirection: "column"}}>
        <Text style={{fontFamily: "Inter", fontSize: 18, marginLeft: "32%", marginTop: "2%"}}>Account Settings</Text>
      </View>
  );
}
