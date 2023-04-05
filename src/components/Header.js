//import liraries

import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";
import imagePaths from "../constants/imagePaths";

import { AuthContext } from "../context/AuthContext";
import routes from "../navigation/routes";
// create a component
const Header = () => {
  const navigation = useNavigation();
  const { logout, patientInfo, setPatientInfo } = useContext(AuthContext);
  const text = "";
  return (
    <View>
      <List.Item
        style={{ marginHorizontal: 10 }}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        descriptionStyle={{ color: "gray" }}
        title={`Hello ${
          patientInfo.patientName == null ? text : patientInfo.patientName
        }`}
        description={`How are you feeling today !!`}
        left={(props) => (
          <TouchableOpacity onPress={() => logout()}>
            <Image
              source={imagePaths.avatar_man}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        )}
        right={(props) => (
          <TouchableOpacity
            onPress={() => {
              setPatientInfo({});
              setTimeout(() => {
                navigation.navigate(routes.SELECT_PROFILE);
              }, 100);
            }}
          >
            <Image
              source={imagePaths.profile2}
              style={{ width: 45, height: 45 }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Header;
