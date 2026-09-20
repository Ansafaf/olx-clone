import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig :object= {
    apiKey: "AIzaSyCzB5DPyoJv4y-JExE0hVf-KKMovlZXEzk",
    authDomain: "react-app-fd1ea.firebaseapp.com",
    projectId: "react-app-fd1ea",
    storageBucket: "react-app-fd1ea.firebasestorage.app",
    messagingSenderId: "1040416275577",
    appId: "1:1040416275577:web:43d7cd499359cac42b68a8",
    measurementId: "G-JBPXZTGE2Q"
}

const  app = initializeApp(firebaseConfig);

export const auth = getAuth(app);