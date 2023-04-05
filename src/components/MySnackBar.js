import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar } from "react-native-paper";

const MySnackBar = ({ showSnackbar, setShowSnackbar, snackBarText }) => {
  return (
    <Snackbar
      visible={showSnackbar}
      duration={4000}
      style={{}}
      wrapperStyle={{}}
      onDismiss={() => {
        setShowSnackbar(false);
        console.log("dismissed");
      }}
      action={{}}
      onIconPress={() => {}}
    >
      {snackBarText}
    </Snackbar>
  );
};

export default MySnackBar;
