import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Text,
  View,
  Image,
} from "react-native";
import { List, Avatar } from "react-native-paper";
import routes from "../../navigation/routes";

const randomRGB = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red},${green},${blue})`;
};

const DoctorListScreen = ({ route , navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { specialization } = route.params;
  const getDoctors = async () => {
    try {
      const response = await fetch(
        `https://aefc-103-156-19-229.in.ngrok.io/api/v1/doctor/getAllDoctors`,{
          headers:{
            "ngrok-skip-browser-warning": "1",
            Authorization:'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuc3NrMiIsImlhdCI6MTY3OTc0OTA5NywiZXhwIjoxNjc5ODM1NDk3fQ.pVtp6xi9iJJaXY3ePedsMALCVizrV1XvnlpdJvDsWPBApbe01qJVUo3brkr_3qEOpsh9aI5YFLsKeDNfW6owHw'
        }
        }
      );
      const json = await response.json();
      console.log("###");
      console.log(json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "white" }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <List.Item
                onPress={() => {
                  console.log(item.fname);
                  navigation.navigate(routes.VIDEO, {
                    doctor: item,
                  });
                }}
                title={`${item.fname} ${item.lname}`}
                description={`${item.qualification}`}
                left={(props) => (
                  <Image
                    source={require(`../../../assets/general-doc.png`)}
                    style={{ width: 55, height: 55 }}
                  />
                )}
              />
            </View>
          )}
        />
      )}
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
    height: 100,
    width: "90%",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#F5ECFF",
  },
});

export default DoctorListScreen;
