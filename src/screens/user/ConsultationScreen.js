//import liraries
import React, { useState, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { List, Text, Divider, Button } from "react-native-paper";
import Header from "../../components/Header";
import routes from "../../navigation/routes";
import { getAllPreviousConsultations } from "../../service/ConsultationService";
import { downloadDocument } from "../../service/DocumentService";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { verticalScale } from "../../constants/metrics";
import { getDoctorById } from "../../service/DoctorService";

const ConsultationScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(true);
  const [downloading, setDownloading] = React.useState(false);
  const [data, setData] = useState([]);
  const { patientInfo } = useContext(AuthContext);
  const patientId = patientInfo.patientId;

  const getDateTime = (starttime) => {
    const dateObj = new Date(starttime);

    const options = {
      year: "numeric",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    };

    const dateString = dateObj.toLocaleString("en-IN", options);
    const d = dateString.split(/[' ']/);
    const monthname = d[1];
    const year = d[5];
    const t = d[4].split(/[':']/);
    const temp = t[0] == 0 || t[0] == 12 ? 12 : t[0] % 12;
    const time = temp + ":" + t[1];
    const ap = t[0] != 0 && t[0] > 11 ? "PM" : "AM";

    const day = dateObj.getDate();
    const ordinalIndicator = getOrdinalIndicator(day);
    const formattedDay = `${day}${ordinalIndicator}`;

    const formattedDate1 = `${formattedDay} ${monthname} | ${time} ${ap}`;
    const formattedDate2 = `${formattedDate1}-${year}-${time}`;

    function getOrdinalIndicator(day) {
      const j = day % 10,
        k = day % 100;
      if (j == 1 && k != 11) {
        return "st";
      }
      if (j == 2 && k != 12) {
        return "nd";
      }
      if (j == 3 && k != 13) {
        return "rd";
      }
      return "th";
    }

    return { formattedDay, formattedDate1, formattedDate2 };
  };

  const getPreviousConsultations = async (patientId) => {
    try {
      setRefreshing(true);
      const json = await getAllPreviousConsultations(patientId);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPreviousConsultations(patientId);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Header />
        <>
          <Spinner visible={refreshing || downloading} />
          <List.Section
            title="My Consultations"
            titleStyle={{ fontWeight: "bold", fontSize: 25, color: "grey" }}
          ></List.Section>
          {data && data.length > 0 ? (
            <FlatList
              scrollEnabled
              showsVerticalScrollIndicator
              data={data}
              keyExtractor={(item) => item.consultId}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      backgroundColor: "#F7F8FF",
                      marginHorizontal: 20,
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <List.Accordion
                      theme={{
                        colors: { background: "#F7F8FF" },
                      }}
                      titleStyle={{
                        color: "#414141",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                      descriptionStyle={{ color: "gray", fontSize: 11 }}
                      title={`Dr.${item.doctorName}`}
                      description={
                        getDateTime(`${item.startTime}`).formattedDate1
                      }
                    >
                      <>
                        <Divider />

                        <Text style={styles.text}>Documents</Text>

                        <View
                          style={{
                            flexDirection: "row",
                            paddingLeft: 15,
                            flexWrap: "wrap",
                          }}
                        >
                          {item.documentDetailsList
                            .filter((document) => document.isAvailible)
                            .map((document) =>
                              document.id == item.prescription ? null : (
                                <TouchableOpacity
                                  key={document.id}
                                  onPress={async () => {
                                    setDownloading(true);
                                    await downloadDocument(
                                      document.id,
                                      document.name,
                                      document.document_type
                                    );
                                    setDownloading(false);
                                  }}
                                >
                                  <View
                                    style={{
                                      ...styles.myChip,
                                      backgroundColor: "#E8DDF8",
                                    }}
                                  >
                                    <Text
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                      style={{ fontSize: 11, color: "#564264" }}
                                    >
                                      {document.name}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              )
                            )}
                          {item.prescription ? (
                            <TouchableOpacity
                              onPress={async () => {
                                setDownloading(true);
                                await downloadDocument(
                                  item.prescription,
                                  "prescription-" +
                                    item.doctorName +
                                    getDateTime(`${item.startTime}`)
                                      .formattedDay,
                                  "application/pdf"
                                );
                                setDownloading(false);
                              }}
                            >
                              <View
                                style={{
                                  ...styles.myChip,
                                  backgroundColor: "#edf8dd",
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={{ fontSize: 11, color: "black" }}
                                >
                                  Prescription
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 15,
                          }}
                        >
                          <Text style={styles.text}>Follow up</Text>
                          <View style={{ flexDirection: "row" }}>
                            <Button
                              labelStyle={styles.text}
                              style={{
                                borderRadius: 2,
                                borderColor: "black",
                                borderWidth: 0.3,
                                //backgroundColor: "#E2EEDA",
                              }}
                              mode="outlined"
                              onPress={async () => {
                                const doctor = await getDoctorById(
                                  item.doctorId
                                );
                                navigation.navigate(routes.DOCTOR_DETAILS, {
                                  doctor,
                                  followUp: item.consultId,
                                });
                              }}
                            >
                              Same doctor
                            </Button>

                            <View style={{ width: 10 }} />

                            <Button
                              labelStyle={{ ...styles.text }}
                              style={{
                                borderRadius: 2,
                                borderColor: "black",
                                borderWidth: 0.3,
                                // backgroundColor: "#E8DDF8",
                              }}
                              mode="outlined"
                              onPress={() => {
                                navigation.navigate(routes.DOCTOR_LIST, {
                                  followUp: item.consultId,
                                  specialization: item.specialization,
                                });
                              }}
                            >
                              Different doctor
                            </Button>
                          </View>
                        </View>
                      </>
                    </List.Accordion>
                  </View>
                );
              }}
            />
          ) : (
            <View style={styles.box_empty}>
              <Text style={{ color: "gray", fontSize: 17, fontWeight: "500" }}>
                No Consulatations
              </Text>
            </View>
          )}
        </>
      </View>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  indicator: {
    height: "50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  myChip: {
    width: "auto",
    overflow: "visible",
    borderRadius: 25,
    borderColor: "black",
    borderWidth: 0.5,
    padding: 8,

    margin: 3,
  },
  box_empty: {
    height: verticalScale(100),
    padding: 10,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: "#F7F8FF",
  },
  box: {
    height: 120,
    width: "92%",
    padding: 10,
    margin: 15,
    borderRadius: 20,
    backgroundColor: "#F7F8FF",
  },
  text: {
    color: "gray",
    fontSize: 11,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
});

//make this component available to the app
export default ConsultationScreen;
