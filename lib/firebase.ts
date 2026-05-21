import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOL4WkODyJuEmXKj5R9gBt3GDKJqdILMU",
  authDomain: "daliyjobs.firebaseapp.com",
  projectId: "daliyjobs",
  storageBucket: "daliyjobs.firebasestorage.app",
  messagingSenderId: "463763027401",
  appId: "1:463763027401:web:0374aa46182595e9952418",
  measurementId: "G-GTC2Z14DB0"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
