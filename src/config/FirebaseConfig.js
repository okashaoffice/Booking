import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBFDcR_Xe91bd-gdoA9NZ53mdjBeABlY2A",
  authDomain: "bookingwebapp-76aba.firebaseapp.com",
  projectId: "bookingwebapp-76aba",
  storageBucket: "bookingwebapp-76aba.appspot.com",
  messagingSenderId: "1078739168948",
  appId: "1:1078739168948:web:aa74c15bad9c21ec6571e1",
  measurementId: "G-BQZW95Y9WS",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
