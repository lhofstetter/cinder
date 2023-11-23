import * as React from "react";
import * as Font from "expo-font";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, Image, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as SecureStore from 'expo-secure-store';

import UploadItem from "./components/Upload.js";
import Explore from "./components/Explore.js";
import DetailsPost from "./components/SetPost.js";
import PreviewPost from "./components/Preview.js";
import Profile from "./components/Profile.js";
import Matches from "./components/Matches.js";
import LoginScreen from "./components/LoginScreen.js";
import AccountCreate from "./components/AccountCreate.js";

const homeFocused = require("./assets/home.png");
const homeUnfocused = require("./assets/home_unfocused.png");
const uploadFocused = require("./assets/upload.png");
const uploadUnfocused = require("./assets/upload_unfocused.png");
const profileFocused = require("./assets/profile.png");
const profileUnfocused = require("./assets/profile_unfocused.png");
const likesFocused = require("./assets/likes_unfocused.png");
const likesUnfocused = require("./assets/likes.png");

function Swipe() {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <Explore />
    </SafeAreaView>
  ) : (
    <Explore />
  );
}

function User() {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <Profile />
    </SafeAreaView>
  ) : (
    <Profile />
  );
}

function Login(){
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <LoginScreen />
    </SafeAreaView>
  ) : (
    <LoginScreen />
  );
}

function Account(){
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <AccountCreate />
    </SafeAreaView>
  ) : (
    <AccountCreate />
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

function Details() {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <DetailsPost />
    </SafeAreaView>
  ) : (
    <>
      <DetailsPost />
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

const LoginStack = createNativeStackNavigator();

function LoginRoute() {
  return (
    <LoginStack.Navigator screenOptions={{headerShown:false}}>
      <LoginStack.Screen name="Login" component={Login}/>
      <LoginStack.Screen name="Sign Up" component={Account}/>
    </LoginStack.Navigator>
  );
}

const UploadStack = createNativeStackNavigator();

function UploadRoute() {
  return (
    <UploadStack.Navigator screenOptions={{headerTitleStyle: {fontFamily: "Inter"}}}>
      <UploadStack.Screen name="Upload" component={Upload}/>
      <UploadStack.Screen name="New Listing" component={Details} options={{ headerBackVisible: false, gestureEnabled: false}}/>
      <UploadStack.Screen name="Preview" component={Preview} options={{ headerBackVisible: false }} />
    </UploadStack.Navigator>
  );
}

const MatchStack = createNativeStackNavigator();

function MatchRoute() {
  return (
    <MatchStack.Navigator screenOptions={{headerTitleStyle: {fontFamily: "Inter"}}}>
      <MatchStack.Screen name="Matches" component={Matches}/>
    </MatchStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
          initialRouteName="Swipe"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              let iconName;
              let image;

              if (route.name === "Swipe") {
                iconName = focused ? "homeFocus" : "homeUnfocused";
                image = focused ? homeFocused : homeUnfocused;

                return Platform.OS == "web" ? <img src={image} /> : <Image source={image} />;
              } else if (route.name === "UploadRoute") {
                iconName = focused ? "uploadFocus" : "uploadUnfocused";
                image = focused ? uploadFocused : uploadUnfocused;

                return Platform.OS == "web" ? <img src={image} /> : <Image source={image} />;
              } 
              else if (route.name === "MatchRoute") {
                iconName = focused ? "likesFocused" : "likesUnfocused";
                image = focused ? likesFocused : likesUnfocused;

                return <Image source={image} />;
              }
              else if (route.name === "User") {
                iconName = focused ? "profileFocus" : "profileUnfocused";
                image = focused ? profileFocused : profileUnfocused;

                return <Image source={image} />;
              } else if (route.name == "Match") {
                iconName = focused ? "matchFocus" : "matchUnfocused";
                image = focused ? matchFocused : matchUnfocused;

                return <Image source={image}/>
              }
              
            },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "gray",
            tabBarShowLabel: false,
          })}
        >
          <Tab.Screen name="Swipe" component={Swipe} options={{ headerShown: false }} listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                if (navigation.getState().routes[1].state != undefined && navigation.getState().routes[1].state.index >= 1) {
                  e.preventDefault();
                  Alert.alert('Discard Post?', 'You\'ll lose all progress on this post if you leave! Are you sure you want to?', [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    {
                      text: 'Leave',
                      style: 'destructive',
                      onPress: () => {navigation.navigate("Swipe", {})},
                    },
                  ])
                }
              }
            })}/>
          <Tab.Screen name="UploadRoute" component={Upload} options={{ headerShown: false, unmountOnBlur: true }} />
          <Tab.Screen name="MatchRoute" component={MatchRoute} options={{ headerShown: false, unmountOnBlur: true }} />
          <Tab.Screen name="User" component={User} options={{ headerShown: false }} listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                if (navigation.getState().routes[1].state != undefined && navigation.getState().routes[1].state.index >= 1) {
                  e.preventDefault();
                  Alert.alert('Discard Post?', 'You\'ll lose all progress on this post if you leave! Are you sure you want to?', [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    {
                      text: 'Leave',
                      style: 'destructive',
                      onPress: () => {navigation.navigate("User", {})},
                    },
                  ])
                }
              }
            })}/>
        </Tab.Navigator>
  );
}

const AppStack = createNativeStackNavigator();
let tempLogin = null;
let initialRoute = null;

export default function App() {
  const [fontLoaded, setFontLoaded] = React.useState(false);
  const [login, setLogin] = React.useState(null);

  async function loadFont() {
    await Font.loadAsync({
      "Inter": require("./assets/fonts/static/Inter-Regular.ttf"),
    });

    setFontLoaded(true);
  }

  async function getLoginInfo() { 
    let username = await SecureStore.getItemAsync("username");
    let password = await SecureStore.getItemAsync("password");
    
    setLogin({"username": username, "password": password});
    tempLogin = {"username": username, "password": password};
    if (tempLogin.username != null) {
      initialRoute = "App Path";
    } else {
      initialRoute = "Login Path";
    }
  }

  React.useEffect(() => {
    getLoginInfo();
    loadFont();
  }, []);

  if (tempLogin == null) {
    return (<View></View>);
  } else {
    return (<ActionSheetProvider>
      <NavigationContainer>
        <AppStack.Navigator initialRouteName={initialRoute}>
          <AppStack.Screen name="Login Path" component={LoginRoute} options={{headerShown:false}}/>
          <AppStack.Screen name="App Path" component={TabNavigator} options={{ headerShown:false, gestureEnabled: false}}/>
        </AppStack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>);
  }
}
