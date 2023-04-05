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
import { List, Text, Divider } from "react-native-paper";
import Header from "../../components/Header";
import routes from "../../navigation/routes";
import { getAllPreviousConsultations } from "../../service/ConsultationService";
import { downloadDocument } from "../../service/DocumentService";
import { AuthContext } from "../../context/AuthContext";

// create a component
const ConsultationScreen = ({ navigation }) => {
  //const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(true);
  const [data, setData] = useState([]);
  const { setBottomBarVisible, patientInfo } = useContext(AuthContext);
  const patientId = patientInfo.patientId;
  const startTime = "09:00 28/01/2022";

  const getDateTime = (starttime) => {
    const dateObj = new Date(starttime);

    const options = {
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      dateStyle: "short",
    };

    const dateString = dateObj.toLocaleString("en-US", options);

    const d = dateString.split(/[' ']/);
    const weekday = d[0];
    const monthname = d[1];
    const year = d[4];
    const t = d[3].split(/[':']/);
    const time = t[0] + ":" + t[1];
    const day = dateObj.getDate();
    const ordinalIndicator = getOrdinalIndicator(day);
    const formattedDay = `${day}${ordinalIndicator}`;

    const formattedDate1 = `${formattedDay}-${monthname}`;
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

    return { formattedDate1, formattedDate2 };
  };

  const getPreviousConsultations = async (patientId) => {
    try {
      setRefreshing(true);
      const json = await getAllPreviousConsultations(patientId);
      console.log("Json msg");
      console.log(json);
      setData(json);
    } catch (error) {
      console.log("error");
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPreviousConsultations(patientId);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("REEEEF");
      getPreviousConsultations(patientId);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      {refreshing ? (
        <ActivityIndicator style={styles.indicator} />
      ) : (
        <>
          <List.Section
            title="My Consultations"
            titleStyle={{ fontWeight: "bold", fontSize: 25, color: "grey" }}
          ></List.Section>
          <FlatList
            scrollEnabled
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator
            data={data}
            keyExtractor={(item) => item.consultId}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#F5ECFF",
                  marginHorizontal: 20,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <List.Accordion
                  theme={{
                    colors: { background: "#F5ECFF" },
                  }}
                  titleStyle={{
                    color: "#414141",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                  descriptionStyle={{ color: "gray", fontSize: 11 }}
                  title={`Dr.${item.doctorName}`}
                  description="12 March  |  11 AM "
                >
                  <>
                    <Divider />

                    <Text
                      style={{
                        color: "gray",
                        fontSize: 11,
                        fontWeight: "bold",
                        marginHorizontal: 15,
                        marginTop: 10,
                        marginBottom: 5,
                      }}
                    >
                      Documents
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingLeft: 15,
                        flexWrap: "wrap",
                      }}
                    >
                      {item.documentDetailsList.map((document) => {
                        return (
                          <TouchableOpacity
                            key={document.id}
                            onPress={() => {
                              console.log("Press");
                              downloadDocument(document.id);
                            }}
                          >
                            <View
                              style={{
                                width: "auto",
                                overflow: "visible",
                                maxWidth: 150,
                                borderRadius: 10,
                                borderColor: "#564264",
                                borderWidth: 1,
                                padding: 8,
                                backgroundColor: "#dac8f4",
                                margin: 3,
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
                        );
                      })}

                      <TouchableOpacity
                        onPress={() => {
                          console.log("Press");
                        }}
                      >
                        <View
                          style={{
                            width: "auto",
                            overflow: "visible",
                            borderRadius: 10,
                            borderColor: "black",
                            borderWidth: 1,
                            padding: 8,
                            backgroundColor: "#edf8dd",
                            margin: 3,
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
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Press");
                      }}
                    ></TouchableOpacity>
                  </>
                </List.Accordion>
              </View>

              // <View style={styles.box}>
              //   <List.Item
              //     onPress={() => {
              //       console.log("Prev_Consultation");
              //       navigation.navigate(routes.CONSULTATION_DETAILS, {
              //         consultation: item,
              //       });
              //     }}
              //     titleStyle={{
              //       color: "black",
              //       fontSize: 30,
              //       fontFamily: "serif",
              //       marginBottom: 2,
              //     }}
              //     title={`Dr.${item.doctorName}`}
              //     descriptionStyle={{ color: "black" }}
              //     description={
              //       <Text
              //         numberOfLines={3}
              //         style={{ color: "black", fontSize: 15 }}
              //       >
              //         {item.specialization}
              //         {"\n"}
              //         {getDateTime(item.startTime).formattedDate1}
              //       </Text>
              //     }
              //     // description={`13:45-12/01/2023    14:09-12/01/2023`}
              //   />
              // </View>
            )}
          />
        </>
      )}
    </View>
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
  box: {
    height: 120,
    width: "92%",
    padding: 10,
    margin: 15,
    borderRadius: 20,
    backgroundColor: "#F5ECFF",
  },
});

//make this component available to the app
export default ConsultationScreen;
