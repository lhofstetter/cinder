import * as React from "react";
import UploadItem from "./components/Upload.js";
import Explore from "./components/Explore.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, View, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

function Swipe({ navigation }) {
    return (
        <>
            <Explore/>
            <Button
                title="Upload"
                onPress={() => navigation.navigate("Upload")}
            />
        </>
    );
}

function Upload() {
    return <UploadItem />;
}

const Stack = createNativeStackNavigator();

export default function App() {
    if (Platform.OS == 'ios') {
        return (
            <SafeAreaView>
                <ActionSheetProvider>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="Swipe">
                            <Stack.Screen name="Swipe" component={Swipe} />
                            <Stack.Screen name="Upload" component={Upload} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ActionSheetProvider>
            </SafeAreaView>
        );
    } else {
        return (
            <ActionSheetProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Swipe">
                        <Stack.Screen name="Swipe" component={Swipe} />
                        <Stack.Screen name="Upload" component={Upload} />
                     </Stack.Navigator>
                </NavigationContainer>
            </ActionSheetProvider>
        );
    }
   
}
