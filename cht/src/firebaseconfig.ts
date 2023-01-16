// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXO9FtTqDfZGu4yafQxZqtp_Ye65US6Yg",
    authDomain: "private-chat-app-7ffaa.firebaseapp.com",
    projectId: "private-chat-app-7ffaa",
    storageBucket: "private-chat-app-7ffaa.appspot.com",
    messagingSenderId: "987957642906",
    appId: "1:987957642906:web:a7215088912ef48ce04123"
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig) as FirebaseApp;

// * It Helps To User The "User-Authentication" Service 
export const auth = getAuth();

// * It Helps To Use The "Files-Uploading" Service 
export const storage = getStorage();

// * It Helps To Use The "Document-Based-Database" Service 
export const db = getFirestore();
