import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Button, FAB, Modal, Portal, Text, Divider } from "react-native-paper";
import {
  uploadDocument,
  docsForConsultation,
  addDocToConsultation,
  removeDocFromConsultation,
} from "../service/DocumentService";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ConsultationDocsFAB = ({ consultationId }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [inConsultation, setInConsultation] = useState([]);
  const [canBeAdded, setCanBeAdded] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { setBottomBarVisible, patientInfo } = useContext(AuthContext);
  const patientId = patientInfo.patientId;

  useEffect(() => {
    getConsultationDocuments(consultationId);
  }, []);

  async function getConsultationDocuments(consultationId) {
    setLoading(true);
    let json = await docsForConsultation(consultationId, patientId);
    setInConsultation(json[0]);
    setCanBeAdded(json[1]);
    setLoading(false);
  }

  //After adding docs to consultaton we should reload the files which are in consultation and not in consultaton .
  async function addDocToConsul(docId) {
    setLoading(true);
    await addDocToConsultation(docId, consultationId);
    await getConsultationDocuments(consultationId);
    setLoading(false);
  }

  //After removeing docs from consultation we shoudl reload the files
  async function removeDocFromConsul(docId) {
    setLoading(true);
    await removeDocFromConsultation(docId, consultationId);
    await getConsultationDocuments(consultationId);
    setLoading(false);
  }

  //After upload we should also reolad all the docs in the consultation and not in consultation also
  async function uploadDoc() {
    setLoading(true);
    await uploadDocument(patientId);
    await getConsultationDocuments(consultationId);
    setLoading(false);
  }
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  return (
    <View>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          showModal();
        }}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}
            style={{
              margin: 20,
            }}
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <View>
                {/* View all the documents that are in the consultation */}
                <Text
                  style={{
                    fontSize: 20,
                    color: "black",
                  }}
                >
                  Documents sent to doctor
                </Text>
                <Text style={styles.subTitle}>Touch to remove</Text>
                <View style={styles.chipContainer}>
                  {inConsultation.map((document) => {
                    return (
                      <TouchableOpacity
                        key={document.id}
                        onPress={() => {
                          removeDocFromConsul(document.id);
                        }}
                      >
                        <View
                          style={{
                            ...styles.chip,
                            backgroundColor: "#edf8dd",
                          }}
                        >
                          <Text
                            numberOfLines={2}
                            overflow="scroll"
                            ellipsizeMode="tail"
                            style={{ fontSize: 11, color: "#564264" }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                color: "red",
                                fontWeight: "bold",
                                alignSelf: "flex-end",
                              }}
                            >
                              {`X   `}
                            </Text>
                            <Text style={{ color: "black" }}>
                              {document.name}
                            </Text>
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* View all the documents that are not yet in the consultation */}

                <Divider
                  style={{
                    color: "black",
                    marginVertical: 10,
                  }}
                />

                <Text
                  style={{
                    fontSize: 20,
                    color: "black",
                  }}
                >
                  Documents Available
                </Text>
                <Text style={styles.subTitle}>Touch to add</Text>
                <View style={styles.chipContainer}>
                  {canBeAdded.map((document) => {
                    return (
                      <TouchableOpacity
                        key={document.id}
                        onPress={() => {
                          console.log("Press");
                          addDocToConsul(document.id);
                        }}
                      >
                        <View style={styles.chip}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 11,
                              overflow: "hidden",

                              color: "#564264",
                            }}
                          >
                            {`${document.name}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Divider
                  style={{
                    color: "black",
                    marginVertical: 15,
                  }}
                />
                <Button
                  icon="upload"
                  onPress={() => {
                    uploadDoc();
                    setLoading(true);
                  }}
                >
                  Upload New Document
                </Button>
              </View>
            )}
          </Modal>
        </Portal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  box: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#F5ECFF",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 30,
    bottom: 100,
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
  },
  subTitle: { color: "grey", fontSize: 12 },
  chip: {
    width: "auto",
    overflow: "scroll",
    maxWidth: 150,
    borderRadius: 10,
    borderColor: "#564264",
    borderWidth: 1,
    padding: 8,
    backgroundColor: "#dac8f4",
    margin: 3,
  },
  chipContainer: {
    flexDirection: "row",
    paddingLeft: 15,
    flexWrap: "wrap",
    marginTop: 5,
    alignItems: "center",
    overflow: "scroll",
  },
});

export { ConsultationDocsFAB };
