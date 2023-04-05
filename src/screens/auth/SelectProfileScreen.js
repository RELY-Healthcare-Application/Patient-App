//import liraries
import React, { Component, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, List } from "react-native-paper";
import SquareTile from "../../components/SquareTile";
import { AuthContext } from "../../context/AuthContext";
import { getProfilesForUser } from "../../service/UserService";
import imagePaths from "../../constants/imagePaths";

// create a component
const SelectProfileScreen = () => {
  const { setBottomBarVisible, setPatientInfo } = useContext(AuthContext);

  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProfiles = async () => {
    const patients = await getProfilesForUser();
    setProfiles(patients);
    console.log(patients);
    setIsLoading(false);
  };

  useEffect(() => {
    getProfiles();
    setBottomBarVisible(false);

    return () => {
      setBottomBarVisible(true);
    };
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ marginTop: 30 }}>
          <List.Section
            title="Choose Profile"
            titleStyle={{ fontWeight: "bold", fontSize: 25, color: "grey" }}
          ></List.Section>
          <View style={styles.squareTiles}>
            {profiles.map((patient) => {
              return (
                <SquareTile
                  key={patient.id}
                  imgSrc={imagePaths.avatar_man}
                  color={"#ECF9E3"}
                  text={patient.fname}
                  onPress={() => {
                    setPatientInfo({
                      patientId: patient.id,
                      patientName: patient.fname,
                    });
                  }}
                />
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  squareTiles: {
    margin: 10,
    flexDirection: "row",
    height: 170,
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

//make this component available to the app
export default SelectProfileScreen;
