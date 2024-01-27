import { env } from "./env/client";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig: FirebaseOptions = {
  apiKey: "IzaSyAt6GaS5rZNxXLSaNf7QsDzR14akBQKNcU",
  authDomain: "ganchat-dd078.firebaseapp.com",
  projectId: "ganchat-dd078",
  storageBucket: "ganchat-dd078.appspot.com",
  messagingSenderId: "728824725279",
  appId: "1:728824725279:web:4a49173d576f72e59aba2a",
  measurementId: "G-TBX6YY8S41",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
