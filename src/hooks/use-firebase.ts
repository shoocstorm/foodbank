import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { useCallback, useState, useEffect } from "react";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBjc-Q9kdh6IbGVXNUokT68gNM29n-cFmw",
  authDomain: "foodshare-17a28.firebaseapp.com",
  projectId: "foodshare-17a28",
  storageBucket: "foodshare-17a28.firebasestorage.app",
  messagingSenderId: "388525386548",
  appId: "1:388525386548:web:12b18032b2ec8e49091361",
  measurementId: "G-6SZH42S96L"
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


export const useSignup = () => {
  const signUp = useCallback(async (userData: {
    email: string;
    password: string;
    displayName: string;
    organization: string
  }) => {
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      const uid = user.uid;
  
      // Add extra user data to Firestore
      await setDoc(doc(db, "users", uid), {
        displayName: userData.displayName,
        company: userData.organization,
        // Add any other fields you need here
      });
  
      console.log("User signed up and data saved to Firestore:", user);
      // Redirect or handle successful signup
    } catch (error: any) {
      console.error("Error signing up or saving data:", error);
      // Handle errors as before, including Firestore errors
      if (error.code === 'auth/email-already-in-use') {
        alert('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        alert('The email address is invalid!');
      } else if (error.code === 'auth/weak-password') {
        alert('The password must be at least 6 characters!');
      }
      else {
        alert('There was a problem signing up. Please try again.');
      }
    }
  }, []);
  
  return { signUp };
  // Example usage (updated HTML form required):
  // const signupForm = document.getElementById("signupForm") as HTMLFormElement;
  // signupForm.addEventListener("submit", async (e) => {
  //   e.preventDefault();
  //   const email = (document.getElementById("email") as HTMLInputElement).value;
  //   const password = (document.getElementById("password") as HTMLInputElement).value;
  //   const displayName = (document.getElementById("displayName") as HTMLInputElement).value;
  //   const age = parseInt((document.getElementById("age") as HTMLInputElement).value);
  //   const company = (document.getElementById("company") as HTMLInputElement).value;
  
  //   await signUp(email, password, displayName, age, company);
  // });
  
  
}

export const useDonations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    // Create a query to get all donations, ordered by creation time
    const q = query(collection(db, "donations"), orderBy("creationTime", "desc"));

    // Set up real-time listener
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const donationsList = querySnapshot.docs.map(donation => ({
          id: donation.id,
          ...donation.data()
        }));
        setDonations(donationsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching donations:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { donations, loading, error };
};