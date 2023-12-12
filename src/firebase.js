// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAK7beWiW_CjQI7si8rVlfg65K19fp8WyE",
  authDomain: "uploading-images-d2bf1.firebaseapp.com",
  projectId: "uploading-images-d2bf1",
  storageBucket: "uploading-images-d2bf1.appspot.com",
  messagingSenderId: "218951691367",
  appId: "1:218951691367:web:8716c069c66a149a23b8c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);