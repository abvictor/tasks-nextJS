import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBJX1LXJukWQxK7WDGZTFTcYWCS_GRmIY4",
  authDomain: "tarefasplus-3a6b4.firebaseapp.com",
  projectId: "tarefasplus-3a6b4",
  storageBucket: "tarefasplus-3a6b4.appspot.com",
  messagingSenderId: "247205887796",
  appId: "1:247205887796:web:72990066edf67da185af61"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }