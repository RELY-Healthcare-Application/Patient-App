import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Text,
  View,
  Image,
  RefreshControl,
} from "react-native";
import { List, Avatar } from "react-native-paper";
import routes from "../../navigation/routes";
import { getAllDoctors } from "../../service/DoctorService";
import { verticalScale } from "../../constants/metrics";

const DoctorListScreen = ({ route, navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { specialization, followUp } = route.params;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getDoctors();
    setRefreshing(false);
  }, []);

  const getDoctors = async () => {
    try {
      const json = await getAllDoctors();
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.wrapper}>
          <FlatList
            data={data}
            keyExtractor={({ id }) => id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View style={styles.box}>
                <List.Item
                  onPress={() => {
                    navigation.navigate(routes.DOCTOR_DETAILS, {
                      doctor: item,
                      followUp,
                    });
                  }}
                  descriptionStyle={{
                    color: "gray",
                    fontSize: 10,
                    fontWeight: "300",
                  }}
                  title={
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {`${item.fname} ${item.lname}`}
                    </Text>
                  }
                  description={`${item.qualification}`}
                  left={(props) => (
                    <Image
                      source={require(`../../../assets/general-doc.png`)}
                      style={{ width: 55, height: 55 }}
                    />
                  )}
                  right={(props) =>
                    item.online_status ? (
                      <Text style={{ alignSelf: "center" }}>🟢 </Text>
                    ) : (
                      <Text style={{ alignSelf: "center" }}>🔴</Text>
                    )
                  }
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  wrapper: {},
  box: {
    height: verticalScale(100),
    padding: 10,
    marginHorizontal: 20,

    justifyContent: "center",
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: "#F7F8FF",
  },
});

export default DoctorListScreen;
