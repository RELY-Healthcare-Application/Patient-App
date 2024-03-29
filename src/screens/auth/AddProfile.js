import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-date-picker";
import { addPatient } from "../../service/PatientService";
import routes from "../../navigation/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { getProfilesForUser } from "../../service/UserService";
const AddProfile = ({ navigation, route }) => {
  const { setProfiles } = route.params;
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDob] = useState(new Date());
  const [bloodGroup, setBloodGroup] = useState("");
  const [sex, setSex] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [relationship, setRelationship] = useState("");

  const showAlert = (message) => Alert.alert("Error ", message);

  const getProfiles = async () => {
    const patients = await getProfilesForUser();
    setProfiles(patients);
  };

  async function handleFormSubmit() {
    let userInfo = await AsyncStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    const userId = userInfo.id;

    let dobString = dob.toISOString().split("T")[0];

    if (
      fname == "" ||
      lname == "" ||
      bloodGroup == "" ||
      city == "" ||
      state == "" ||
      pinCode == "" ||
      relationship == "" ||
      sex == ""
    ) {
      showAlert("All fields are required");
    } else {
      let patient = {
        fname: fname,
        lname: lname,
        sex: sex,
        blood_group: bloodGroup,
        city: city,
        state: state,
        pinCode: pinCode,
        relationship: relationship,
        // age: null,
        dob: dobString,
      };

      addPatient(patient, userId);
      await getProfiles();
      navigation.replace(routes.SELECT_PROFILE);
    }
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        maxLength={30}
        value={fname}
        onChangeText={(text) => {
          text = text.trim();
          if (/^[A-Za-z]+$/.test(text) || text == "") {
            setFname(text);
          } else {
            showAlert("Invalid input for First Name");
          }
        }}
        textColor="black"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        maxLength={20}
        value={lname}
        onChangeText={(text) => {
          text = text.trim();
          if (/^[A-Za-z]+$/.test(text) || text == "") {
            setLname(text);
          } else {
            showAlert("Invalid input for Last Name");
          }
        }}
        textColor="black"
      />

      <Text style={styles.label}>Date of Birth</Text>
      <DatePicker
        style={styles.input}
        date={dob}
        onDateChange={setDob}
        maximumDate={new Date()}
        textColor="purple"
        androidVariant="iosClone"
        mode="date"
      />
      <Text style={styles.label}>Blood Group</Text>
      <Picker
        selectedValue={bloodGroup}
        style={styles.input}
        onValueChange={(itemValue) => setBloodGroup(itemValue)}
      >
        <Picker.Item label="Choose blood group" value="" />
        <Picker.Item label="O +" value="O+" />
        <Picker.Item label="O -" value="O-" />
        <Picker.Item label="A +" value="A+" />
        <Picker.Item label="A -" value="A-" />
        <Picker.Item label="B +" value="B+" />
        <Picker.Item label="B -" value="B-" />
        <Picker.Item label="AB +" value="AB+" />
        <Picker.Item label="AB -" value="AB-" />
      </Picker>

      <Text style={styles.label}>Sex</Text>
      <Picker
        selectedValue={sex}
        style={styles.input}
        onValueChange={(itemValue) => setSex(itemValue)}
      >
        <Picker.Item label="Choose sex" value="" />
        <Picker.Item label="Male" value="M" />
        <Picker.Item label="Female" value="F" />
        <Picker.Item label="Prefer Not to Mention" value="O" />
      </Picker>

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        maxLength={20}
        value={city}
        onChangeText={(text) => {
          text = text.trim();
          if (/^[A-Za-z]+$/.test(text) || text == "") {
            setCity(text);
          } else {
            showAlert("Invalid input for City:Should contain only Letters");
          }
        }}
        textColor="black"
      />

      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.input}
        maxLength={20}
        value={state}
        onChangeText={(text) => {
          text = text.trim();
          if (/^[A-Za-z]+$/.test(text) || text == "") {
            setState(text);
          } else {
            showAlert("Invalid input for State:Should contain only Letters");
          }
        }}
        textColor="black"
      />

      <Text style={styles.label}>Pin(4 Digit)</Text>
      <TextInput
        style={styles.input}
        maxLength={4}
        inputMode="numeric"
        keyboardType="number-pad"
        secureTextEntry
        value={pinCode}
        onChangeText={(text) => {
          text = text.trim();
          if ((/^[0-9]+$/.test(text) || text == "") && text.length <= 4) {
            setPinCode(text);
          } else {
            showAlert(
              "Invalid input for PIN : Should contain only max 4 Numbers"
            );
          }
        }}
        textColor="black"
      />

      <Text style={styles.label}>Relationship</Text>
      <TextInput
        style={styles.input}
        value={relationship}
        maxLength={20}
        onChangeText={(text) => {
          text = text.trim();
          if (/^[A-Za-z]+$/.test(text) || text == "") {
            setRelationship(text);
          } else {
            showAlert(
              "Invalid input for Relationship:Should contain only Letters"
            );
          }
        }}
        textColor="black"
      />

      <View style={styles.submitContainer}>
        <Button
          icon="plus"
          title="Submit"
          mode="contained"
          onPress={handleFormSubmit}
          style={styles.submitButton}
        >
          Add Profile
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  submitContainer: {
    marginBottom: 5,
    marginHorizontal: 5,
    paddingBottom: 50,
    paddingTop: 25,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 1,
    marginBottom: 5,
    backgroundColor: "white",
  },
});

export default AddProfile;
