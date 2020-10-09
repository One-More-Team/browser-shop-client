import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "@firebase/firestore";
import ReduxSagaFirebase from "redux-saga-firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCGE7c92uxQM41-JnR5c7_k26XSgDjEOSk",
  authDomain: "browser-shop.firebaseapp.com",
  databaseURL: "https://browser-shop.firebaseio.com",
  projectId: "browser-shop",
  storageBucket: "browser-shop.appspot.com",
  messagingSenderId: "443868629171",
  appId: "1:443868629171:web:a9b580323fff91ba7448c6",
  measurementId: "G-PYT4ETMZ4X",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const rsf = new ReduxSagaFirebase(firebase);
