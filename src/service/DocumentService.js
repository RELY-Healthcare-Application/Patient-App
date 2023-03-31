import DocumentPicker from "react-native-document-picker";
import axios from "axios";
import { Buffer } from "buffer";
import RNFetchBlob from "rn-fetch-blob";
const { fs } = RNFetchBlob;
const urlBase = "https://1403-103-156-19-229.in.ngrok.io/api/v1";
const patientId = 1; //Dummy patient Id for now later should be changed
const consultationId = 1; //Dummy consultatoin id
const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNjgwMjA2MDg4LCJleHAiOjE2ODAyOTI0ODh9.7c0jWW7y0-V7W2Eogit_82pfn4nnxxHZXDbPfygGhznW77IOlfXHGkbIY4SYGjvZd3ncbsWNpDkI7ChOmVqung"; //returns a array contains 2 seperate arrays where the first array contains all the documents of the patient that are in the consultation and second array contains all the documents of patient that are not in current consultation.

async function removeDocFromConsultation(docId) {
  const config = {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    await axios.get(
      `${urlBase}/consultation/removeDocumentByCid_Docuid/${consultationId}/${docId}`,
      config
    );
    console.log("Document removed from  consultation");
  } catch (err) {
    console.log(err);
  }
}

async function addDocToConsultation(docId) {
  const config = {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    await axios.get(
      `${urlBase}/consultation/addDocumentByCid_Docuid/${consultationId}/${docId}`,
      config
    );
    console.log("Document added to consultation");
  } catch (err) {
    console.log(err);
  }
}
async function docsForConsultation() {
  const config = {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let response = await axios.get(
      `${urlBase}/consultation/getAllDocumentsByCid/${consultationId}`,
      config
    );
    let inConsultation = response.data;
    let allDocs = await getAllDocuments();
    let canBeAdded = allDocs.filter(
      (obj2) => !inConsultation.some((obj1) => obj1.id === obj2.id)
    );
    return [inConsultation, canBeAdded];
  } catch (err) {
    console.log(err);
  }
}

async function downloadDocument(docId) {
  const config = {
    method: "GET",
    "Content-Type": "multipart/form-data",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  try {
    let response = await axios.get(
      `${urlBase}/document/download/${docId}`,
      config
    );
    const pdfstr = response.data;
    const DownloadDir = RNFetchBlob.fs.dirs.DownloadDir;
    let fileName = "test.pdf";
    let pdfLocation = DownloadDir + "/" + fileName;
    console.log(pdfLocation);
    RNFetchBlob.fs.writeFile(pdfLocation, pdfstr, "base64");
    const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
    RNFetchBlob.fs
      .cp(filePath, filePath)
      .then(() =>
        RNFetchBlob.android.addCompleteDownload({
          title: fileName,
          description: "Download complete",
          mime: "base64",
          path: filePath,
          showNotification: true,
        })
      )
      .then(() =>
        RNFetchBlob.fs.scanFile([{ path: filePath, mime: "base64" }])
      );
  } catch (err) {
    console.log(err);
  }
}

async function removeDocument(docId) {
  const config = {
    method: "DELETE",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let response = await axios.delete(
      `${urlBase}/document/delete/${docId}`,
      config
    );
  } catch (err) {
    console.log(err);
  }
}

async function getAllDocuments() {
  const config = {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let response = await axios.get(
      `${urlBase}/document/getAll/${patientId}`,
      config
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

async function uploadDocument() {
  const config = {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const doc = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    const formdata = new FormData();

    formdata.append("file", {
      uri: doc[0].uri,
      type: doc[0].type,
      name: doc[0].name,
      size: doc[0].size,
    });

    let response = await axios.post(
      `${urlBase}/document/upload/${patientId}`,
      formdata,
      config
    );
  } catch (err) {
    console.log(err);
  }
}

export {
  uploadDocument,
  getAllDocuments,
  removeDocument,
  downloadDocument,
  docsForConsultation,
  addDocToConsultation,
  removeDocFromConsultation,
};
