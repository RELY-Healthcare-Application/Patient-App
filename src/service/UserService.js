import axios from "axios";
import { BASE_URL, getConfig } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const urlBase = `${BASE_URL}/api/v1`;

async function getProfilesForUser() {
  try {
    let userInfo = await AsyncStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    const userId = userInfo.id;
    let response = await axios.get(
      `${urlBase}/user/getPatients/${userId}`,
      await getConfig()
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export { getProfilesForUser };
