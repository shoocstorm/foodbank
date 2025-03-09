import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, updateDoc, getDocs, getDoc, deleteDoc, where } from "firebase/firestore";
import { useCallback, useState, useEffect } from "react";
import { User } from "src/contexts/user-context";
import { DonationStatus } from "src/types/donation-types";
import { useNavigate } from "react-router-dom";


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

export interface DonationProps {
  title: string;
  foodType: string;
  status: DonationStatus;
  photo?: String | File | null;
  weight: number;
  expiry: number;
  address: string;
  contactPerson: string;
  contactPhone: string;
  notes: string;

  createdBy?: string;
  creationTime?: number;
  claimedBy?: string;
  claimedAt?: number;
  pickupAt?: number;
  collectionCode?: string;
};

export interface ClaimRequestProps {
  donationId: string;
  claimRequester: string;
  requestAt: number;
  claimResult: string;
  notes: string;
};

export enum DBTables {
  DONATIONS = 'donations',
  USERS = 'users',
  CLAIM_QUEUE = 'claimQueue'
};

// fetches and listens to changes in the donations collection in firestore
export const useDonations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    // Create a query to get all donations, ordered by creation time
    const q = query(collection(db, DBTables.DONATIONS), orderBy("creationTime", "desc"));

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

// fetches and listens to changes in the users collection in firestore
export const useUsers = () => {
  const [users, setUsers] = useState<User[] | any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    // Create a query to get all users
    const q = query(collection(db, DBTables.USERS));

    // Set up real-time listener
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const usersList = querySnapshot.docs.map(user => ({
          uid: user.id,
          ...user.data(),
          status: user.data().status || 'active',
          isVerified: user.data().isVerified || false
        }));
        setUsers(usersList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching users:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { users, loading, error };
};

// add a donation
export const useAddDonation = () => {
  const addDonation = useCallback(async (donation: DonationProps) => {
    try {
      const docRef = await addDoc(collection(db, DBTables.DONATIONS), donation);
      console.log("Donation written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding donation: ", e);
      throw e;
    }
  }, []);

  return { addDonation };
};

export const useSignup = () => {
  const signUp = useCallback(async (userData: {
    email: string;
    password: string;
    displayName: string;
    organization: string;
    role: string;
  }) => {
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      const uid = user.uid;
  
      // Add extra user data to Firestore
      await setDoc(doc(db, DBTables.USERS, uid), userData);
  
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
  
}

// update a donation from a claim / unclaim action
export const useClaimUnClaim = () => {
  const updateStatus = useCallback(async (donationId: string, status: DonationStatus, collectionCode?: string) => {
    let message = '';
    let result = false;
    
    try {
      if (status === DonationStatus.CLAIMED) {
        // Add claim request to queue
        const claimRequest = {
          donationId,
          claimRequester: auth.currentUser?.uid,
          requestAt: Date.now(),
          claimResult: 'Pending',
          notes: ''
        };
        await addDoc(collection(db, DBTables.CLAIM_QUEUE), claimRequest);

        // Wait for 1 seconds for data synchronization (i.e.: if the claim request was added during a offline mode)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check claim queue for this donation
        const queueQuery = query(
          collection(db, DBTables.CLAIM_QUEUE),
          where('donationId', '==', donationId),
          orderBy('requestAt', 'asc')
        );
        const queueSnapshot = await getDocs(queueQuery);
        const claimRequests: any[] = queueSnapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter( (req: any) => req.donationId === donationId);

        // Get current donation status to check if it's still active
        const donationRef = doc(db, DBTables.DONATIONS, donationId);
        const donationSnap = await getDoc(donationRef);
        const currentDonation = donationSnap.data();

        if (claimRequests.length === 1 && 
            claimRequests[0].claimRequester === auth.currentUser?.uid && 
            currentDonation?.status === DonationStatus.ACTIVE) {
          // Update donation status to claim this donation
          await updateDoc(donationRef, { 
            status, 
            collectionCode, 
            claimedBy: auth.currentUser?.uid, 
            claimedAt: Date.now() 
          });
          
          // Delete claim request from queue
          const claimRef = doc(db, DBTables.CLAIM_QUEUE, claimRequests[0].id);
          await deleteDoc(claimRef);
          
          result = true;
          message = "Donation claimed successfully";
          console.log(message);

        } else {
          // Delete invalid claim requests of this user
          const userClaimRequests = claimRequests.filter((req: any) => req.claimRequester === auth.currentUser?.uid);
          if (userClaimRequests) {
            userClaimRequests.forEach(async (req: any) => {
              const claimRef = doc(db, DBTables.CLAIM_QUEUE, req.id);
              await deleteDoc(claimRef);
            });

            result = false;
            message = "Concurrent claim detected or donation no longer active";
            console.log(message);
          }
          
        }
      } else {
        // unclaim
        const donationRef = doc(db, DBTables.DONATIONS, donationId);
        await updateDoc(donationRef, { status, claimedBy: null });
        result = true;
        message = "Donation unclaimed successfully";
        console.log(message);
      }
    } catch (e) {
      message = "Error updating document: ";
      console.error("Error updating document: ", e);
      result = false;
    }

    return { result, message };
  }, []);

  return { updateStatus };
};

// update a donation status to PICKED-UP or revert back to CLAIMED
export const useConfirmPickup = () => {
  const updatePickupStatus = useCallback(async (donationId: string, status: string) => {
    try {
      const donationRef = doc(db, DBTables.DONATIONS, donationId);
      if (status === DonationStatus.PICKED_UP) {
        await updateDoc(donationRef, { status, pickupAt: Date.now() });
      } else {
        await updateDoc(donationRef, { status, pickupAt: null });
      }
      console.log(`Document status updated to ${status} successfully`);
      return true;
    } catch (e) {
      console.error("Error updating document: ", e);
      return false;
    }
  }, []);

  return { updatePickupStatus };
};

// duplicate a donation
export const useDuplicateDonation = () => {
  const { addDonation } = useAddDonation();
  const navigate = useNavigate();

  const duplicateDonation = useCallback(async (donationData: DonationProps) => {
    try {
      const donation: DonationProps = {
        ...donationData,
        status: DonationStatus.ACTIVE,
        createdBy: auth.currentUser?.uid,
        creationTime: new Date().getTime(),
      };

      await addDonation(donation);
      return { success: true, message: 'Donation duplicated successfully' };
    } catch (error) {
      console.error('Error duplicating donation:', error);
      return { success: false, message: 'Failed to duplicate donation' };
    }
  }, [addDonation]);

  return { duplicateDonation };
};

// delete a donation
export const useDeleteDonation = () => {
  const deleteDonation = useCallback(async (donationId: string) => {
    let message = '';
    let result = false;

    try {
      // Get the donation document
      const donationRef = doc(db, DBTables.DONATIONS, donationId);
      const donationSnap = await getDoc(donationRef);
      const donationData = donationSnap.data();

      // Check if the current user is the creator of the donation
      if (donationData?.createdBy !== auth.currentUser?.uid) {
        message = "You can only delete your own donations";
        return { result, message };
      }

      // Delete any claim requests for this donation
      const queueQuery = query(
        collection(db, DBTables.CLAIM_QUEUE),
        where('donationId', '==', donationId)
      );
      const queueSnapshot = await getDocs(queueQuery);
      const deleteClaimPromises = queueSnapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deleteClaimPromises);

      // Delete the donation document
      await deleteDoc(donationRef);

      result = true;
      message = "Donation deleted successfully";
      console.log(message);
    } catch (e) {
      message = "Error deleting donation";
      console.error("Error deleting donation: ", e);
      result = false;
    }

    return { result, message };
  }, []);

  return { deleteDonation };
};