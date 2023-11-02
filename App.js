import * as React from "react";
import UploadItem from "./components/Upload.js";
import Explore from "./components/Explore.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, View, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import PreviewPost from "./components/Preview.js";

function Swipe({ navigation }) {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <Explore />
      <Button color={"#000000"} title="Upload" onPress={() => navigation.navigate("Upload")} />
    </SafeAreaView>
  ) : (
    <>
      <Explore />
      <Button title="Upload" onPress={() => navigation.navigate("Upload")} />
    </>
  );
}

function Upload() {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <UploadItem/>
    </SafeAreaView>
  ) : (
    <>
      <UploadItem/>
    </>
  );
}

function Preview() {
  return Platform.OS == "ios" ? (
    <SafeAreaView>
      <PreviewPost/>
    </SafeAreaView>
  ) : (
    <>
      <PreviewPost/>
    </>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Swipe"
          screenOptions={{presentation:"modal"}}
        >
          <Stack.Screen
            name="Swipe"
            component={Swipe}
            options={{ headerShown: false }}
          />
            <Stack.Screen name="Upload" component={Upload}/>
          
          <Stack.Screen name="New Listing" component={Preview}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
