import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useCallback } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDnX2acjEWT2SHOkZ8PPh20ElKWI7raCuw",
  authDomain: "food-hero-8dd9e.firebaseapp.com",
  databaseURL: "https://food-hero-8dd9e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "food-hero-8dd9e",
  storageBucket: "food-hero-8dd9e.firebasestorage.app",
  messagingSenderId: "969908622641",
  appId: "1:969908622641:web:12f55ddc7b988a36a98c10",
  measurementId: "G-DB2D3LN8DQ"
};

// Initialize Firebase
export const firebaseapp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseapp);
export const auth = getAuth(firebaseapp);
export const db = getFirestore(firebaseapp);

export const usePostDonation = () => {
  const addDonation = useCallback(async (donation: {
    title: string;
    foodType: string;
    weight: number;
    photo: File | null;
    expiry: number;
    address: string;
    contactPerson: string;
    contactPhoneNumber: string;
    notes: string;
  }) => {
    try {
      const docRef = await addDoc(collection(db, "donations"), donation);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, []);

  return { addDonation };
};
