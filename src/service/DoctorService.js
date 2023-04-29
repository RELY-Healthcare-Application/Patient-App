import axios from "axios";
import { BASE_URL, getConfig } from "../config";
import Toast from "react-native-simple-toast";
import { refreshToken } from "./AuthService";

const urlBase = `${BASE_URL}/api/v1`;

const getAllDoctors = async () => {
  console.log("Get ALL Doctors");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/doctor/getAllDoctors`,
      await getConfig()
    );
    return response.data;
  } catch (err) {
    console.log(err);
    Toast.show("Unable to get all doctors", 10);
  }
};

const getDoctorsBySpecialisation = async (specialisation) => {
  console.log("Get ALL Doctors BY Specialisation");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/doctor/getAllDoctorsBySpec/${specialisation}`,
      await getConfig()
    );
    return response.data;
  } catch (err) {
    console.log(err);
    Toast.show("Unable to get all doctors", 10);
  }
};

const addPatientToQueue = async (doctorId, patientId) => {
  console.log("addPatientToQueue");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/dqueue/addPatient/${doctorId}/${patientId}`,
      await getConfig()
    );
  } catch (err) {
    console.log(err);
    Toast.show("Unable to fetch doctor by spec.", 10);
  }
};

const removePatientFromQueue = async (doctorId, patientId) => {
  console.log("removePatientFromoQueue");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/dqueue/removePatient/${doctorId}/${patientId}`,
      await getConfig()
    );
  } catch (err) {
    console.log(err);
    Toast.show("Unable to remove patient from queue", 10);
  }
};

const getPatientIndexFromQueue = async (
  doctorId,
  patientId,
  setIndex,
  setAccept
) => {
  console.log("getPatientIndexFromQueue");
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/dqueue/getPatientIndex/${doctorId}/${patientId}`,
      await getConfig()
    );
    setIndex(response.data.index);
    setAccept(response.data.accept);

    return response.data;
  } catch (err) {
    console.log(err);
    Toast.show("Unable to fetch patient Index from queue", 10);
  }
};

const getDeferredPatientIndexFromQueue = async (
  doctorId,
  patientId,
  index,
  accept,
  setIndex,
  setAccept
) => {
  console.log("getDefferedPatientIndexFromQueue");
  try {
    await refreshToken();
    console.log(
      `${urlBase}/dqueue/getPatientIndex`,
      {
        patientId,
        doctorId,
        index,
        accept,
      },
      await getConfig()
    );
    const response = await axios.post(
      `${urlBase}/dqueue/getPatientIndex`,
      {
        patientId,
        doctorId,
        index,
        accept,
      },
      await getConfig()
    );
    console.log("res", response.data);
    setIndex(response.data.index);
    setAccept(response.data.accept);
    return response.data;
  } catch (error) {
    console.log(error.response.status);
    if (error.response.status == 503) {
      await refreshToken();
      console.log("timeout fetchagain");
      // getDeferredPatientIndexFromQueue(
      //   doctorId,
      //   patientId,
      //   index,
      //   accept,
      //   setIndex,
      //   setAccept
      // );
    } else {
      Toast.show("Unable to fetch patient Index from queue", 10);
    }
  }
};

const addAndGetIndexFromQueue = async (
  doctorId,
  patientId,
  setIndex,
  setAccept
) => {
  try {
    await refreshToken();
    await axios.get(
      `${urlBase}/dqueue/addPatient/${doctorId}/${patientId}`,
      await getConfig()
    );
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/dqueue/getPatientIndex/${doctorId}/${patientId}`,
      await getConfig()
    );
    setIndex(response.data.index);
    setAccept(response.data.accept);
    return response.data;
  } catch (err) {
    console.log(err);
    Toast.show("Unable to add/fetch patient index from queue", 10);
  }
};

const updateDoctorRating = async (doctorId, starRating) => {
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/doctor/updateDoctorRating/${doctorId}/${starRating}`,
      await getConfig()
    );
  } catch (err) {
    console.log("rating", err);
    Toast.show("Unable to update doctor rating", 10);
  }
};

const getAllPatientsFromDqueue = async (doctorId) => {
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/dqueue/getPatients/${doctorId}`,
      await getConfig()
    );
    return response.data;
  } catch (err) {
    console.log(err);
    Toast.show("Unable to fetch patients from queue", 10);
  }
};

const getDoctorById = async (doctorId) => {
  try {
    await refreshToken();
    const response = await axios.get(
      `${urlBase}/doctor/getDoctorById/${doctorId}`,
      await getConfig()
    );
    return response.data;
  } catch (err) {
    console.log(err);
    Toast.show("Unable to fetch doctor by Id", 10);
  }
};

export {
  getAllDoctors,
  addPatientToQueue,
  removePatientFromQueue,
  getPatientIndexFromQueue,
  addAndGetIndexFromQueue,
  updateDoctorRating,
  getAllPatientsFromDqueue,
  getDoctorById,
  getDoctorsBySpecialisation,
  getDeferredPatientIndexFromQueue,
};
