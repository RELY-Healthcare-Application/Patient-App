import axios from "axios";
import { BASE_URL, getConfig } from "../config";
import Toast from "react-native-simple-toast";
import { refreshToken } from "./AuthService";

const urlBase = `${BASE_URL}/api/v1`;

const getAllPreviousConsultations = async (patientId) => {
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/consultation/getPrevConsultations/${patientId}`,
      await getConfig()
    );
    return response.data;
  } catch (error) {
    console.log(error);
    Toast.show("Unable to fetch consultations", 10);
  }
};

const getPrevConsultDetails = async (consultId) => {
  console.log("Get Individual Previous Consultation Details");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/consultation/getAllDocumentsByCid/${consultId}`,
      await getConfig()
    );
    return response.data;
  } catch (error) {
    console.log(error);
    Toast.show("Unable to fetch consultation details", 10);
  }
};

const addConsultation = async (patientId, doctorId, startTime, followUp) => {
  console.log("Creating new Consultation with followup", followUp);
  try {
    await refreshToken();
    const response = await axios.post(
      `${urlBase}/consultation/addConsultation`,
      {
        patient_id: patientId,
        doctor_id: doctorId,
        start_time: startTime,
        followup_id: followUp,
      },
      await getConfig()
    );
    return response.data;
  } catch (error) {
    console.log(error);
    Toast.show("Unable to add consultation", 10);
  }
};

const getQuickDoctor = async () => {
  console.log("Get Doctor with least patients for Quick Consultation");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/dqueue/getQuickDoctor`,
      await getConfig()
    );
    return response.data;
  } catch (error) {
    console.log(error);
    Toast.show("Unable to get quick doctor", 10);
  }
};

const getFollowUp = async (patient_id) => {
  console.log("Get Follow Up of All Patients");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/consultation/getFollowUp/${patient_id}`,
      await getConfig()
    );
    return response.data;
  } catch (error) {
    console.log(error);
    Toast.show("Unable to get Followups", 10);
  }
};

export {
  getAllPreviousConsultations,
  getPrevConsultDetails,
  addConsultation,
  getQuickDoctor,
  getFollowUp,
};
