import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { List, Button, FAB } from "react-native-paper";
import React, { useState, useEffect, useContext } from "react";
import {
  uploadDocument,
  getAllDocumentsList,
  removeDocument,
  downloadDocument,
  viewDocument,
} from "../../service/DocumentService";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { verticalScale } from "../../constants/metrics";

const DocumentScreen = ({ navigation }) => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [downloading, setDownloading] = React.useState(false);
  const { patientInfo } = useContext(AuthContext);
  const patientId = patientInfo.patientId;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getDocuments();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDocuments();
    });
    return unsubscribe;
  }, []);

  async function getDocuments() {
    setLoading(true);
    let id = patientInfo.patientId;
    let data = await getAllDocumentsList(id);
    setDocs(data);
    setLoading(false);
  }

  async function docUpload() {
    setLoading(true);
    await uploadDocument(patientId);
    await getDocuments();
  }

  async function removeDoc(docId) {
    setLoading(true);
    await removeDocument(docId);
    await getDocuments();
  }

  return (
    <>
      <View style={styles.container}>
        <Header />
        <Spinner visible={isLoading || downloading} />

        <List.Section
          title="Documents"
          titleStyle={{ fontWeight: "bold", fontSize: 25, color: "grey" }}
        ></List.Section>
        {docs && docs.length > 0 ? (
          <FlatList
            scrollEnabled
            showsVerticalScrollIndicator
            data={docs}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            centerContent
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => (
              <View style={styles.box}>
                <List.Item
                  title={`${item.name}`}
                  titleStyle={{ color: "black" }}
                  right={() => {
                    return (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Button
                            textColor="gray"
                            icon="download"
                            onPress={async () => {
                              setDownloading(true);
                              await downloadDocument(
                                item.id,
                                item.name,
                                item.document_type
                              );
                              setDownloading(false);
                            }}
                          ></Button>

                          <Button
                            textColor="gray"
                            icon="delete"
                            onPress={async () => {
                              setDownloading(true);
                              await removeDoc(item.id);
                              setDownloading(false);
                            }}
                          ></Button>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          />
        ) : (
          <View style={styles.box_empty}>
            <Text style={{ color: "gray", fontSize: 17, fontWeight: "500" }}>
              No Documents
            </Text>
          </View>
        )}
      </View>
      <FAB
        icon="plus"
        textColor="black"
        mode="flat"
        label="Add Document"
        size="small"
        variant="primary"
        style={styles.fab}
        onPress={() => {
          docUpload();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#F7F8FF",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
//make this component available to the app
export default DocumentScreen;
