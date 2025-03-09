import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, updateDoc, getDocs, getDoc, deleteDoc, where, writeBatch } from "firebase/firestore";
import { useCallback, useState, useEffect } from "react";
import { User } from "src/types/auth-types";
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
  CLAIM_QUEUE = 'claimQueue',
  NOTIFICATIONS = 'notifications'
};

export interface NotificationProps {
  id: string;
  from: string;
  category: 'donation-created' | 'donation-claimed' | 'donation-picked-up' | 'donation-deleted';
  message: string;
  time: number;
  status: 'read' | 'unread';
  relatedTo?: string;
  userId: string;
};

// fetches and listens to changes in the notifications collection in firestore
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!authReady) return () => {};
    if (!auth.currentUser) {
      setNotifications([]);
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    // Create a query to get user's notifications, ordered by time
    const q = query(
      collection(db, DBTables.NOTIFICATIONS),
      where('userId', '==', auth.currentUser.uid),
      orderBy('time', 'desc')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const notificationsList = querySnapshot.docs.map(notification => ({
          id: notification.id,
          ...notification.data()
        })) as NotificationProps[];
        setNotifications(notificationsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching notifications:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [authReady]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const notificationRef = doc(db, DBTables.NOTIFICATIONS, notificationId);
      await updateDoc(notificationRef, { status: 'read' });
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const batch = writeBatch(db);
      notifications
        .filter(notification => notification.status === 'unread')
        .forEach(notification => {
          const notificationRef = doc(db, DBTables.NOTIFICATIONS, notification.id);
          batch.update(notificationRef, { status: 'read' });
        });
      await batch.commit();
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, [notifications]);

  const deleteNotifications = useCallback(async (notificationIds: string[]) => {
    try {
      const batch = writeBatch(db);
      notificationIds.forEach(id => {
        const notificationRef = doc(db, DBTables.NOTIFICATIONS, id);
        batch.delete(notificationRef);
      });
      await batch.commit();
      return true;
    } catch (err) {
      console.error('Error deleting notifications:', err);
      return false;
    }
  }, []);

  return { notifications, loading, error, markAsRead, markAllAsRead, deleteNotifications };
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

      // Create notification for the donor
      const notification = {
        from: auth.currentUser?.uid || '',
        category: 'donation-created',
        message: `Your donation "${donation.title}" has been published successfully`,
        time: Date.now(),
        status: 'unread',
        relatedTo: docRef.id,
        userId: auth.currentUser?.uid || ''
      };

      // Add notification to Firestore
      await addDoc(collection(db, DBTables.NOTIFICATIONS), notification);

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

          // Create notifications for both donor and claimer
          const donationData = donationSnap.data();
          const donorNotification = {
            from: auth.currentUser?.uid || '',
            category: 'donation-claimed',
            message: `Your donation "${donationData?.title}" has been claimed`,
            time: Date.now(),
            status: 'unread',
            relatedTo: donationId,
            userId: donationData?.createdBy || ''
          };

          const claimerNotification = {
            from: donationData?.createdBy || '',
            category: 'donation-claimed',
            message: `You have successfully claimed "${donationData?.title}". Collection code: ${collectionCode}`,
            time: Date.now(),
            status: 'unread',
            relatedTo: donationId,
            userId: auth.currentUser?.uid || ''
          };

          // Add notifications to Firestore
          await addDoc(collection(db, DBTables.NOTIFICATIONS), donorNotification);
          await addDoc(collection(db, DBTables.NOTIFICATIONS), claimerNotification);
          
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
        const donationSnap = await getDoc(donationRef);
        const donationData = donationSnap.data();

        await updateDoc(donationRef, { status, claimedBy: null });

        // Create notifications for both donor and claimer
        const donorNotification = {
          from: auth.currentUser?.uid || '',
          category: 'donation-claimed',
          message: `The claim on your donation "${donationData?.title}" has been cancelled`,
          time: Date.now(),
          status: 'unread',
          relatedTo: donationId,
          userId: donationData?.createdBy || ''
        };

        const claimerNotification = {
          from: donationData?.createdBy || '',
          category: 'donation-claimed',
          message: `You have cancelled your claim on "${donationData?.title}"`,
          time: Date.now(),
          status: 'unread',
          relatedTo: donationId,
          userId: auth.currentUser?.uid || ''
        };

        // Add notifications to Firestore
        await addDoc(collection(db, DBTables.NOTIFICATIONS), donorNotification);
        await addDoc(collection(db, DBTables.NOTIFICATIONS), claimerNotification);

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
      const donationSnap = await getDoc(donationRef);
      const donationData = donationSnap.data();

      if (status === DonationStatus.PICKED_UP) {
        await updateDoc(donationRef, { status, pickupAt: Date.now() });

        // Create notifications for both donor and claimer
        const donorNotification = {
          from: auth.currentUser?.uid || '',
          category: 'donation-picked-up',
          message: `Your donation "${donationData?.title}" has been picked up`,
          time: Date.now(),
          status: 'unread',
          relatedTo: donationId,
          userId: donationData?.createdBy || ''
        };

        const claimerNotification = {
          from: donationData?.createdBy || '',
          category: 'donation-picked-up',
          message: `You have picked up "${donationData?.title}"`,
          time: Date.now(),
          status: 'unread',
          relatedTo: donationId,
          userId: donationData?.claimedBy || ''
        };

        // Add notifications to Firestore
        await addDoc(collection(db, DBTables.NOTIFICATIONS), donorNotification);
        await addDoc(collection(db, DBTables.NOTIFICATIONS), claimerNotification);

      } else {
        await updateDoc(donationRef, { status, pickupAt: null });

        // Create notifications for both donor and claimer
        const donorNotification = {
          from: auth.currentUser?.uid || '',
          category: 'donation-picked-up',
          message: `The pickup status of your donation "${donationData?.title}" has been reverted`,
          time: Date.now(),
          status: 'unread',
          relatedTo: donationId,
          userId: donationData?.createdBy || ''
        };

        const claimerNotification = {
          from: donationData?.createdBy || '',
          category: 'donation-picked-up',
          message: `The pickup status of "${donationData?.title}" has been reverted to claimed`,
          time: Date.now(),
          status: 'unread',
          relatedTo: donationId,
          userId: donationData?.claimedBy || ''
        };

        // Add notifications to Firestore
        await addDoc(collection(db, DBTables.NOTIFICATIONS), donorNotification);
        await addDoc(collection(db, DBTables.NOTIFICATIONS), claimerNotification);
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

      // If donation was claimed or picked up, notify the claimer
      if (donationData?.claimedBy && 
          (donationData?.status === DonationStatus.CLAIMED || 
           donationData?.status === DonationStatus.PICKED_UP)) {
        // Create notification for the claimer
        const claimerNotification = {
          from: auth.currentUser?.uid || '',
          category: 'donation-deleted',
          message: `The donation "${donationData?.title}" that you ${donationData?.status === DonationStatus.PICKED_UP ? 'picked up' : 'claimed'} has been deleted by the donor`,
          time: Date.now(),
          status: 'unread',
          relatedTo: donationId,
          userId: donationData.claimedBy
        };

        // Add notification to Firestore
        await addDoc(collection(db, DBTables.NOTIFICATIONS), claimerNotification);
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