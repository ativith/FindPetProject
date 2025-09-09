if (typeof global.structuredClone !== "function") {
  global.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}
import React, { useState, useEffect } from "react";
//import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Account from "./screens/Account";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";
import FindPetScreen from "./screens/FindPetScreen";
import FindOwnerScreen from "./screens/FindOwnerScreen";
import FindHomeScreen from "./screens/FindHomeScreen";
import AddNewPost from "./screens/AddNewPost";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import DetailOfPost from "./screens/DetailOfPost";
import { Pressable } from "react-native";
import SearchPopUp from "./screens/SearchPopUp";
import FilterHandler from "./context/FilterContext";
import Radar from "./screens/Radar";
import { ChatProvider } from "./provider/ChatProvider";
import ChatDetailScreen from "./screens/ChatDetailScreen";
import AuthProvider from "./provider/AuthProvider";
import { useAuth } from "./provider/AuthProvider";
import AlertFormScreen from "./screens/AlertFormScreen";
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const queryClient = new QueryClient();
export default function App() {
  //const [session, setSession] = useState(null);

  /*useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.unsubscribe?.();
    };
  }, []); */

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddNewPost" component={AddNewPost} />
        <Stack.Screen name="Radar" component={Radar} />
        <Stack.Screen name="detailOfPost" component={DetailOfPost} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        <Stack.Screen
          name="AlertFormScreen"
          component={AlertFormScreen}
          options={{
            headerShown: true, // แสดง Header สำหรับหน้านี้ (หากต้องการ)
            presentation: "modal", // ตัวเลือกเสริม (แสดงแบบ Modal)
          }}
        />
      </Stack.Navigator>
    );
  }
  function TabScreens() {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color="black" size={24} />
            ),
          }}
        />

        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbox-outline" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  function FindHomeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="hee"
          component={FindHomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="detailOfPost" component={DetailOfPost} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      </Stack.Navigator>
    );
  }
  function FindOwnerStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="kuay"
          component={FindOwnerScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="detailOfPost" component={DetailOfPost} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      </Stack.Navigator>
    );
  }
  function LostPetStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="LostPet"
          component={FindPetScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="detailOfPost" component={DetailOfPost} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        {/*
        <Stack.Screen
          name="searchPopUp"
          component={SearchPopUp}
          options={{
            presentation: "transparentModal",
            headerShown: false,
            cardOverlayEnabled: true,
            animation: "slide_from_bottom",

            headerRight: (props) => (
              <MaterialIcons name="cancel" size={24} color="black" />
            ),
          }}
        /> */}
      </Stack.Navigator>
    );
  }

  function DrawerScreens() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="Main"
          component={MainStack}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "Tabs";

            // base options ที่อยากให้มีตลอด

            // เงื่อนไขซ่อน header ตอนอยู่หน้า detailOfPost
            if (
              routeName === "Radar" ||
              routeName === "detailOfPost" ||
              routeName === "ChatDetail" ||
              routeName === "AddNewPost"
            ) {
              return { headerShown: false };
            }
            return { headerShown: true };
          }}
        />
        <Drawer.Screen
          name="FindPet"
          component={LostPetStack}
          options={({ route }) => {
            // ตรวจว่าหน้าปัจจุบันคือ detailOfPost หรือไม่
            const routeName = getFocusedRouteNameFromRoute(route) ?? "LostPet";

            if (routeName === "detailOfPost" || routeName === "ChatDetail") {
              return { headerShown: false };
            }
            return { headerShown: true };
          }}
        />
        <Drawer.Screen
          name="FindOwner"
          component={FindOwnerStack}
          options={({ route }) => {
            // ตรวจว่าหน้าปัจจุบันคือ detailOfPost หรือไม่
            const routeName = getFocusedRouteNameFromRoute(route) ?? "kuay";

            if (routeName === "detailOfPost" || routeName === "ChatDetail") {
              return { headerShown: false };
            }
            return { headerShown: true };
          }}
        />
        <Drawer.Screen
          name="FindHome"
          component={FindHomeStack}
          options={({ route }) => {
            // ตรวจว่าหน้าปัจจุบันคือ detailOfPost หรือไม่
            const routeName = getFocusedRouteNameFromRoute(route) ?? "hee";

            if (routeName === "detailOfPost" || routeName === "ChatDetail") {
              return { headerShown: false };
            }
            return { headerShown: true };
          }}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <FilterHandler>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            <NavigationContainer>
              <MainApp />
            </NavigationContainer>
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </FilterHandler>
  );
  function MainApp() {
    const { session } = useAuth(); // ดึง session จาก context

    return <>{session && session.user ? <DrawerScreens /> : <Auth />}</>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
