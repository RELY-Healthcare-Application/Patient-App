import React, { useState, useContext, useEffect } from "react";
import AgoraUIKit from "agora-rn-uikit";
import { Alert, Text, View, BackHandler } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ConsultationDocsFAB } from "../../components/ConsultationDocsFAB";
import { removePatientFromQueue } from "../../service/DoctorService";
import routes from "../../navigation/routes";
import { StackActions } from "@react-navigation/native";

const VideoCall = ({ navigation, route }) => {
  const { setBottomBarVisible } = useContext(AuthContext);
  const { doctor, consultationId, patientId } = route.params;
  const [inVideoCall, setInVideoCall] = useState(true);
  console.log(doctor);
  console.log(consultationId);
  const connectionData = {
    appId: "5e2ee6c6fc13459caa99cb8c234d42e0",
    channel: doctor.channel_name,
    token: doctor.token,
  };

  const callbacks = {
    EndCall: () => {
      console.log("END CALL");
      setInVideoCall(false);
      removePatientFromQueue(doctor.id, patientId);
      navigation.replace(routes.HOME);
    },
  };

  const myalert = (e, unsubscribe) => {
    if (!inVideoCall) {
      return;
    }
    e.preventDefault();
    Alert.alert(
      "Are you sure you want to exit the Consultation",
      "You will have to rejoin the queue if you leave this screen",
      [
        { text: "Don't leave", style: "cancel", onPress: () => {} },
        {
          text: "Leave",
          style: "destructive",

          onPress: () => {
            unsubscribe();
            console.log(e.data);
            navigation.replace(routes.HOME);
          },
        },
      ]
    );
  };

  useEffect(() => {
    setBottomBarVisible(false);

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      myalert(e, unsubscribe);
    });

    return () => {
      setBottomBarVisible(true);
      unsubscribe();
    };
  }, [navigation, inVideoCall]);

  return inVideoCall ? (
    <View style={{ flex: 1 }}>
      <AgoraUIKit connectionData={connectionData} rtcCallbacks={callbacks} />
      <ConsultationDocsFAB consultationId={consultationId} />
    </View>
  ) : (
    <Text setVideoCall={setInVideoCall} onPress={() => setInVideoCall(true)}>
      Start Call
    </Text>
  );
};

export default VideoCall;
