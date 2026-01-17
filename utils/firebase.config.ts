// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCn2iJdbQBA1ZDPdTACuvB12yJS9Wf3UC8",
	authDomain: "agribot-10b8b.firebaseapp.com",
	databaseURL: "https://agribot-10b8b-default-rtdb.firebaseio.com",
	projectId: "agribot-10b8b",
	storageBucket: "agribot-10b8b.firebasestorage.app",
	messagingSenderId: "703897361050",
	appId: "1:703897361050:web:2b9296959a2772d57e5d23",
	measurementId: "G-KLS74LCVEF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
