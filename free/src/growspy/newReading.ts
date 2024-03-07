/* eslint-disable  @typescript-eslint/no-var-requires */
// import {FirebaseItem} from "../types";
import * as functions from "firebase-functions";
import * as firebase from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
} from "firebase/firestore";

const newReading = async (
  req: functions.https.Request,
  firebaseApp: firebase.FirebaseApp,
) => {
  try {
    const collectionName = "growspy";
    const db = getFirestore(firebaseApp);
    const collectionRef = collection(db, collectionName);
    const {body} = req;
    const reading = {
      created: Date.now(),
      ...body,
    };
    const savedReading = await addDoc(collectionRef, reading);
    return {
      code: "200",
      severity: "success",
      message: "Growspy Reading",
      data: {
        fbId: savedReading.id,
        reading,
      },
    };
  } catch (error: any) {
    return {
      code: "500",
      severity: "error",
      message: "Growspy Reading Error",
      data: {
        error,
      },
    };
  }
};

export default newReading;
