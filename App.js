import * as React from "react";
import UploadItem from "./components/Upload.js";
import Explore from "./components/Explore.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, View, Text, Platform, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import PreviewPost from "./components/Preview.js";

const homeFocused = require("./assets/home.png");
const homeUnfocused = require("./assets/home_unfocused.png");
const uploadFocused = require("./assets/upload.png");
const uploadUnfocused = require("./assets/upload_unfocused.png");

const styles = {
  buttonMobile: {
    position: "flex",
    bottom: "-55%",
  },
  buttonText: {
    textAlign: "center",
    fontSize:24,
  }
}

function Swipe({ navigation }) {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <Explore />
    </SafeAreaView>
  ) : (
      <Explore />
  );
}

function Upload() {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <UploadItem />
    </SafeAreaView>
  ) : (
    <>
      <UploadItem />
    </>
  );
}

function Preview() {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <PreviewPost />
    </SafeAreaView>
  ) : (
    <>
      <PreviewPost />
    </>
  );
}

const UploadStack = createNativeStackNavigator();

function UploadRoute () {
  return (
    <UploadStack.Navigator>
        <UploadStack.Screen name="Upload" component={Upload}/>
        <UploadStack.Screen name="New Listing" component={Preview}/>
    </UploadStack.Navigator>
  );
}



const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Swipe" screenOptions={({ route }) => ({
          presentation: "modal",
          tabBarIcon: ({ focused }) => {
            let iconName;
            let image;

            if (route.name === 'Swipe') {
              iconName = focused ? 'homeFocus' : 'homeUnfocused';
              image = focused ? homeFocused : homeUnfocused;
              
              return (Platform.OS == 'web' ? <img src={image}/> : <Image source={image}/>);
            } else if (route.name === 'UploadRoute') {
              iconName = focused ? 'uploadFocus' : 'uploadUnfocused';
              image = focused ? uploadFocused : uploadUnfocused;

              return (Platform.OS == 'web' ? <img src={image}/> : <Image source={image}/>);
            }
          }, 
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
        })}>
          <Tab.Screen name="Swipe" component={Swipe} options={{ headerShown: false }} />
          <Tab.Screen name="UploadRoute" component={UploadRoute} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
