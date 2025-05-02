import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "@/firebase/firebaseConfig";
import { collection, addDoc, getDoc, doc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SignInProps, SignUpParams, User } from "@/types";

export const signIn = async ({ email, password }: SignInProps) => {
  console.log("User trying to sign-in with ", email, " and ", password);
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used client-side.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};

export const signUp = async ({ email, password, firstName, lastName, role }: SignUpParams) => {
  try {
    console.log("user try to sign-up with")
    console.log(email, " ", password)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      role,
      email,
      firstName,
      lastName,
      telephone: '',
      description: '',
      profileImageUrl: '',
      isVerified: false,
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    console.log("User signed up:", user.uid);
    return user;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, profileData);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getLoggedInUser = async () => {
  return auth.currentUser;
};

export const getUserInfo = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    const storageRef = ref(storage, `profileImages/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    // Update Firestore with the new profile image URL
    await updateUserProfile(userId, { profileImageUrl: downloadUrl });

    return downloadUrl;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

export const fetchUserUpcomingTrips = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated.");

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const userData = userSnap.data();
    return userData.upcomingTrips
      ? userData.upcomingTrips.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      : [];
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    throw error;
  }
};

export const fetchUserPastTrips = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated.");

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const userData = userSnap.data();
    const now = new Date();

    return userData.upcomingTrips
      ? userData.upcomingTrips
          .filter((trip: any) => new Date(trip.date).getTime() < now.getTime())
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [];
  } catch (error) {
    console.error("Error fetching past trips:", error);
    throw error;
  }
};

// export const submitReview = async ({ businessId, rating, title, review }: { businessId: string; rating: number; title: string; review: string }) => {
//   try {
//     const businessRef = doc(db, "businesses", businessId);

//     await updateDoc(businessRef, {
//       reviews: arrayUnion({
//         rating,
//         title,
//         review,
//         createdAt: new Date().toISOString(),
//       }),
//     });

//     console.log("Review submitted successfully.");
//   } catch (error) {
//     console.error("Error submitting review:", error);
//     throw error;
//   }
// };

export const submitReview = async ({ businessId, rating, title, review }: { 
  businessId: string; 
  rating: number; 
  title: string; 
  review: string; 
}) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User must be signed in to submit a review.");
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found in Firestore.");
    }

    const { firstName, lastName } = userSnap.data() as { firstName?: string; lastName?: string };

    const userName = `${firstName || ""} ${lastName || ""}`.trim() || "Anonymous";

    const businessRef = doc(db, "businesses", businessId);

    await updateDoc(businessRef, {
      reviews: arrayUnion({
        authorName: userName,
        rating,
        title,
        review,
        createdAt: new Date().toISOString(),
      }),
    });

    console.log("Review submitted successfully.");
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};
