import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import routes from "./routes";
import { HomeScreen, ConsultationScreen, DocumentScreen, VideoCall } from "../screens/";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DoctorListScreen from "../screens/doctor/DoctorsListScreen";

const Tab = createMaterialBottomTabNavigator();

const HomeStack = createNativeStackNavigator();
const DocumentStack = createNativeStackNavigator();

function HomeStackRenderer() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={routes.HOME}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={routes.DOCTOR_LIST}
        component={DoctorListScreen}
      />

      <HomeStack.Screen
        name={routes.VIDEO}
        component={VideoCall}
      />
    </HomeStack.Navigator>
  );
}

function DocumentStackRenderer() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={routes.DOCUMENTS}
        component={DocumentScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function Router() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        labeled={false}
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStackRenderer}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={22} />
            ),
          }}
        />
        <Tab.Screen
          name="DocumentStack"
          component={DocumentStackRenderer}
          options={{
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="file-document"
                color={color}
                size={22}
              />
            ),
          }}
        />
        <Tab.Screen
          name={routes.CONSULTATION}
          component={ConsultationScreen}
          options={{
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-group"
                color={color}
                size={22}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Router;
