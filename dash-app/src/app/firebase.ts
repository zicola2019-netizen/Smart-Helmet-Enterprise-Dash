import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // السطر الجديد ده

const firebaseConfig = {
  apiKey: "AIzaSyAkYWJXRhmvgCX8Km9nkVbMP7QQYTj2ru",
  authDomain: "smart-helmet-enterprise.firebaseapp.com",
  databaseURL: "https://smart-helmet-enterprise-default-rtdb.firebaseio.com",
  projectId: "smart-helmet-enterprise",
  storageBucket: "smart-helmet-enterprise.firebasestorage.app",
  messagingSenderId: "897773263673",
  appId: "1:897773263673:web:504182271b49cda674a6e8"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // والسطر الجديد ده