import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import doctorSpecializations from "../constants/doctorSpecializations";
import routes from "../navigation/routes";

const SpecializationsModal = ({ navigation, hideModal }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <FlatList
        persistentScrollbar
        keyExtractor={(item) => item.name}
        data={doctorSpecializations}
        numColumns={3}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                hideModal();
                navigation.navigate(routes.DOCTOR_LIST, {
                  specialization: item.name,
                });
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                  height: 120,
                }}
              >
                <Image source={item.url} style={styles.image} />
                <Text style={{ fontSize: 12, marginTop: 5 }}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 50,
    width: 50,
    margin: 10,
  },
});

export default SpecializationsModal;
