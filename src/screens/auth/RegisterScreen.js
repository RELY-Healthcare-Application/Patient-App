import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import { AuthContext } from "../../context/AuthContext";
import MySnackBar from "../../components/MySnackBar";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  const { isLoading, register } = useContext(AuthContext);

  const startRegister = async (name, email, password) => {
    try {
      await register(name, email, password);
      setSnackBarText("Register Successful");
      setShowSnackbar(true);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.status);
      setSnackBarText(`Register Failed : ${error.response.data.message}`);
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
          value={name}
          placeholder="Enter name"
          onChangeText={(text) => setName(text)}
        />

        <TextInput
          mode="outlined"
          style={styles.input}
          value={email}
          placeholder="Enter email"
          onChangeText={(text) => setEmail(text)}
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
            startRegister(name, email, password);
          }}
        >
          Register
        </Button>

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Text>Already have an accoutn? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Login</Text>
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
  button: {
    paddingVertical: 3,
    backgroundColor: "#dac8f4",
  },
  input: {
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 14,
    backgroundColor: "white",
  },
  link: {
    color: "#6600cc",
  },
});

export default RegisterScreen;
