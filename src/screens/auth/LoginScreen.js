import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import { TextInput, Button, Snackbar } from "react-native-paper";
import MySnackBar from "../../components/MySnackBar";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const { isLoading, login } = useContext(AuthContext);

  const startLogin = async (userName, password) => {
    try {
      await login(userName, password);
      setShowSnackbar(true);
    } catch (error) {
      setSnackBarText(`Login Failed ${error.response.data.message}`);
      setShowSnackbar(true);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <View style={styles.wrapper}>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={userName}
          placeholder="Enter Username"
          onChangeText={(text) => setUserName(text)}
        />
        <TextInput
          mode="outlined"
          style={styles.input}
          value={password}
          placeholder="Enter password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <Button
          style={styles.button}
          mode="outlined"
          textColor="black"
          onPress={() => {
            startLogin(userName, password);
          }}
        >
          Login
        </Button>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Text>Don't have an account? </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MySnackBar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        snackBarText={snackBarText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  wrapper: {
    width: "80%",
  },
  input: {
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 14,
    backgroundColor: "white",
  },
  button: {
    paddingVertical: 3,
    backgroundColor: "#dac8f4",
  },
  link: {
    color: "#6600cc",
  },
});

export default LoginScreen;
