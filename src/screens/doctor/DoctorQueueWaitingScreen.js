//import liraries
import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import {
  addAndGetIndexFromQueue,
  getPatientIndexFromQueue,
  removePatientFromQueue,
} from "../../service/DoctorService";
import routes from "../../navigation/routes";
import SquareTile from "../../components/SquareTile";
import { AuthContext } from "../../context/AuthContext";
import { addConsultation } from "../../service/ConsultationService";

// create a component
const DoctorQueueWaitingScreen = ({ navigation, route }) => {
  const { doctor } = route.params;
  const [index, setIndex] = useState(null);
  let interval;
  const { setBottomBarVisible, patientInfo } = useContext(AuthContext);
  const patientId = patientInfo.patientId;
  const [joinedQueue, setJoinedQueue] = useState(false);
  const [isLoading, setLoading] = useState();

  const refreshPatientIndex = () => {
    getPatientIndexFromQueue(doctor.id, patientId, setIndex);
  };

  const removePatient = () => {
    removePatientFromQueue(doctor.id, patientId);
  };

  const myalert = (e, unsubscribe) => {
    e.preventDefault();
    Alert.alert(
      "Are you sure you want to leave the Queue",
      "You will have to rejoin the queue if you leave the screen",
      [
        { text: "Don't leave", style: "cancel", onPress: () => {} },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            unsubscribe();
            removePatient();
            navigation.dispatch(e.data.action);
          },
        },
      ]
    );
  };

  useEffect(() => {
    setBottomBarVisible(false);

    const callapi = async () => {
      setLoading(true);
      await addAndGetIndexFromQueue(doctor.id, patientId, setIndex);
      setLoading(false);
    };

    callapi();

    interval = setInterval(() => {
      getPatientIndexFromQueue(doctor.id, patientId, setIndex);
    }, 10000);

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (joinedQueue) {
        return;
      } else {
        myalert(e, unsubscribe);
      }
    });

    return () => {
      setBottomBarVisible(true);
      console.log("Interval Cleared");
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigation, joinedQueue]);

  return (
    <View style={styles.container}>
      <View style={styles.squareTiles}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <SquareTile
            imgSrc={null}
            imgAlt={index}
            color={"#F5EDF8"}
            text={"Position in Queue"}
            onPress={() => {
              refreshPatientIndex();
            }}
          />
        )}
      </View>
      {index == 1 ? (
        <Button
          mode="contained"
          style={{ width: 150 }}
          onPress={async () => {
            setJoinedQueue(true);
            console.log("Interval Cleared");
            clearInterval(interval);
            var consultationId = await addConsultation(
              patientId,
              doctor.id,
              "2023-03-30T21:46:14.679+00:00"
            );
            navigation.replace(routes.VIDEO, {
              doctor: doctor,
              consultationId: consultationId,
              patientId: patientId,
            });
          }}
        >
          Join Video Call
        </Button>
      ) : (
        <View>
          <Text> Please wait for your turn </Text>
        </View>
      )}
      <Button
        mode="contained"
        style={{ width: 150, marginTop: 10 }}
        buttonColor="red"
        textColor="white"
        onPress={(e) => {
          navigation.goBack();
        }}
      >
        Leave Queue
      </Button>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    fontSize: 25,
  },
  squareTiles: {
    flexDirection: "row",
    width: "100%",
    height: "30%",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

//make this component available to the app
export default DoctorQueueWaitingScreen;
