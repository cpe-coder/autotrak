import { getDatabase } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyALdciRWibe5zTWarsi0yuzvMIvAkE7yww",
	authDomain: "autotrak-31c44.firebaseapp.com",
	projectId: "autotrak-31c44",
	storageBucket: "autotrak-31c44.firebasestorage.app",
	messagingSenderId: "1096867222102",
	appId: "1:1096867222102:web:6e6881bb5da6a21e4be1f7",
	measurementId: "G-10MZH4BNHE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
