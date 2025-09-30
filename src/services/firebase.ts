// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚡ Configuração do Firebase (substitui pelos dados do console)
const firebaseConfig = {

  apiKey: "AIzaSyBMU-CB9jUSY_YY9mV8f6jsRHC3lN2aNGs",
  authDomain: "ninjas-nkt.firebaseapp.com",
  databaseURL: "https://ninjas-nkt-default-rtdb.firebaseio.com",
  projectId: "ninjas-nkt",
  storageBucket: "ninjas-nkt.firebasestorage.app",
  messagingSenderId: "209814428255",
  appId: "1:209814428255:web:34cdffef5cfe5d9b2c19ea"

};


// Inicializa app
const app = initializeApp(firebaseConfig);

// Serviços
export const db = getFirestore(app);
export const storage = getStorage(app);
