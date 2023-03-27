import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const SquareTile = ({ imgSrc, color, text, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <View
        style={{
          padding: 10,
          borderRadius: 20,
          backgroundColor: color,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          margin: 5,
        }}
      >
        <Image
          source={imgSrc}
          style={{ width: 65, height: 65, marginBottom: 20 }}
        />
        <View style={{ width: 150, alignItems: "center" }}>
          <Text style={{ fontSize: 12 }}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SquareTile;
