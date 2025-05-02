import { storage, db } from "./firebaseConfig";
import { doc, getDoc, getDocFromCache, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getUserByWAID } from '@/firebase/users';

export async function updateSettings(uid, params) {
    // Update the setting field in collection "settings/<uid>"
    const userRef = doc(collection(db, 'settings'), `${uid}-settings`);
    await setDoc(userRef, params, { merge: true });
    console.log("Updated the settings successfully.")
}