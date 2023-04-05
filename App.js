//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Router from "./src/navigation/Router";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaView>
  );
};

export default App;
