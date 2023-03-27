//import liraries
import React, { Component } from "react";
import { Image, StyleSheet } from "react-native";
import { List } from "react-native-paper";

// create a component
const Header = () => {
  return (
    <List.Item
      style={{ marginHorizontal: 10 }}
      title={`Hello Kiran`}
      description={`How are you feeling today !!`}
      left={(props) => (
        <Image
          source={require(`../../../assets/man.png`)}
          style={{ width: 50, height: 50 }}
        />
      )}
    />
  );
};

export default Header;
