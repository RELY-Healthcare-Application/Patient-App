//import liraries
import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Portal, Modal } from "react-native-paper";
import {
  addAndGetIndexFromQueue,
  getDeferredPatientIndexFromQueue,
  getPatientIndexFromQueue,
  removePatientFromQueue,
} from "../../service/DoctorService";
import routes from "../../navigation/routes";
import SquareTile from "../../components/SquareTile";
import { AuthContext } from "../../context/AuthContext";
import { addConsultation } from "../../service/ConsultationService";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

// create a component
const DoctorQueueWaitingScreen = ({ navigation, route }) => {
  const { doctor, followUp } = route.params;
  const [index, setIndex] = useState(null);
  const [accept, setAccept] = useState(null);
  let interval;
  const { setBottomBarVisible, patientInfo } = useContext(AuthContext);
  const patientId = patientInfo.patientId;
  const [joinedQueue, setJoinedQueue] = useState(false);
  const [leftQueue, setLeftQueue] = useState(false);
  const [isLoading, setLoading] = useState();

  const refreshPatientIndex = () => {
    getPatientIndexFromQueue(doctor.id, patientId, setIndex);
  };

  const removePatient = () => {
    removePatientFromQueue(doctor.id, patientId);
  };

  const dialogDismiss = () => {
    setLeftQueue(true);
    navigation.navigate(routes.HOME);
  };

  const myalert = (e, unsubscribe) => {
    if (leftQueue) {
      return;
    }
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
            navigation.navigate(routes.HOME);
          },
        },
      ]
    );
  };

  useEffect(() => {
    setBottomBarVisible(false);

    if (!leftQueue) {
      if (!index) {
        const callGetIndex = async () => {
          setLoading(true);
          await addAndGetIndexFromQueue(
            doctor.id,
            patientId,
            setIndex,
            setAccept
          );
          setLoading(false);
        };

        callGetIndex();
      }
      if (index && accept != undefined) {
        getDeferredPatientIndexFromQueue(
          doctor.id,
          patientId,
          index,
          accept,
          setIndex,
          setAccept
        );
      }

      // interval = setInterval(() => {

      // }, 2000);
    }

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (joinedQueue || leftQueue) {
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
  }, [navigation, joinedQueue, leftQueue, index, accept]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontStyle: "bold", marginBottom: 10 }}>
        Dr.{doctor.fname} {doctor.lname}
      </Text>
      <View style={styles.squareTiles}>
        {isLoading ? (
          <ActivityIndicator />
        ) : index == -1 ? null : (
          <>
            <SquareTile
              imgSrc={null}
              imgAlt={index}
              color={"#F5EDF8"}
              text={"Position in Queue"}
              onPress={() => {
                refreshPatientIndex();
              }}
            />
          </>
        )}
      </View>
      {index == 1 && accept ? (
        <>
          <CountdownCircleTimer
            size={50}
            isPlaying
            duration={100}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[7, 5, 2, 0]}
            onComplete={async () => {
              await removePatientFromQueue(doctor.id, patientId);
              setLeftQueue(true);
              navigation.navigate(routes.HOME);
            }}
          >
            {({ remainingTime }) => <Text>{remainingTime}</Text>}
          </CountdownCircleTimer>

          <Text style={{ marginVertical: 15 }}>
            Please join the video call before timer ends
          </Text>

          <Button
            mode="contained"
            style={{ width: 150 }}
            onPress={async () => {
              setJoinedQueue(true);

              const currentDateTime = new Date().toISOString();
              clearInterval(interval);
              var consultationId = await addConsultation(
                patientId,
                doctor.id,
                currentDateTime,
                followUp
              );
              navigation.replace(routes.VIDEO, {
                doctor: doctor,
                consultationId: consultationId,
                patientId: patientId,
                followUp,
              });
            }}
          >
            Join Video Call
          </Button>
        </>
      ) : (
        <View>
          <Text> Please wait for your turn </Text>
        </View>
      )}
      {index < 0 ? null : (
        <Button
          mode="contained"
          style={{ width: 150, marginTop: 10 }}
          buttonColor="red"
          textColor="white"
          onPress={(e) => {
            navigation.navigate(routes.HOME);
          }}
        >
          Leave Queue
        </Button>
      )}

      <Portal>
        <Modal
          visible={index == -1}
          onDismiss={dialogDismiss}
          contentContainerStyle={styles.containerStyle}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 50 }}>
            Doctor has gone offline <Text>Sorry for the inconvience</Text>{" "}
            <Text>Please consult an another doctor</Text>
          </Text>
        </Modal>
      </Portal>
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
  containerStyle: {
    alignSelf: "center",
    backgroundColor: "white",
    padding: 20,
    height: "30%",
    width: "75%",
    margin: 10,
  },
});

//make this component available to the app
export default DoctorQueueWaitingScreen;
