import { doc, setDoc, updateDoc, getDoc, getDocs, query, where, collection, addDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { BusinessData, Package, SettingsData, ShowcasingBusinessData } from "@/types";
import { storage } from "@/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const addBusinessToFirestore = async (businessData: Record<string, any>) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        throw new Error("User is not authenticated. Unable to create business.");
      }
  
      // Use the user's UID as the document ID
      const businessId = currentUser.uid;
      const docRef = doc(db, "businesses", businessId);
  
      // Add the timestamp to the business data
      const completeBusinessData = {
        ...businessData,
        packages: [],
        createdAt: new Date().toISOString(), // Timestamp for creation
      };
  
      // Save the document to Firestore
      await setDoc(docRef, completeBusinessData);
  
      console.log("Business document created with ID:", businessId);
      return businessId; // Return the document ID
    } catch (error) {
      console.error("Error adding business to Firestore:", error);
      throw error;
    }
};

export const fetchBusinessData = async (businessId: string) => {
  try {
    const docRef = doc(db, "businesses", businessId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        photos: [],
        numberOfImages: 5,
        ...data, // Merge with Firestore data
      };
    } else {
      throw new Error("No business data found for this user.");
    }
  } catch (error) {
    console.error("Error fetching business data:", error);
    throw error;
  }
};

export const updateBusinessField = async (field: string, value: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated.");
      }
  
      const ownerId = user.uid;
  
      // Reference the document in Firestore using the UID
      const docRef = doc(db, "businesses", ownerId); // Replace "businesses" with your collection name
      await updateDoc(docRef, { [field]: value });
  
      console.log(`Field "${field}" updated successfully in Firestore.`);
    } catch (error) {
      console.error(`Error updating field "${field}":`, error);
      throw new Error("Failed to update field in Firestore.");
    }
};

export const fetchBusinessPackages = async (): Promise<Package[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const businessId = user.uid;
    const businessDoc = await getDoc(doc(db, "businesses", businessId));

    if (!businessDoc.exists()) {
      throw new Error("Business not found.");
    }

    const packageIds: string[] = businessDoc.data().packages || [];
    const packagePromises = packageIds.map(async (id) => {
      const packageDoc = await getDoc(doc(db, "packages", id));
      if (!packageDoc.exists()) {
        return null;
      }

      const packageData = packageDoc.data();
      return {
        id: packageDoc.id,
        amount: packageData.amount || 0,
        status: packageData.status || false,
        capacity: packageData.capacity || 0,
        title: packageData.title || "",
      } as Package;
    });

    const packages = (await Promise.all(packagePromises)).filter(
      (pkg) => pkg !== null
    ) as Package[];
    return packages;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

export const addPackageToFirestore = async (packageData: Record<string, any>): Promise<Package> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User is not authenticated. Unable to create package.");
    }

    const businessId = currentUser.uid;
    const packageId = packageData.id;
    const packageRef = doc(db, "packages", packageId);

    const completePackageData = {
      ...packageData,
      createdAt: new Date().toISOString(),
    };

    await setDoc(packageRef, completePackageData);

    // Update the business document with the new package ID
    const businessRef = doc(db, "businesses", businessId);
    await updateDoc(businessRef, {
      packages: arrayUnion(packageId),
    });

    console.log("Package document created with ID:", packageId);

    // Return the full package object
    return {
      id: packageId,
      ...completePackageData,
    } as Package;
  } catch (error) {
    console.error("Error adding package to Firestore:", error);
    throw error;
  }
};

export const uploadPhotoForBusiness = async (
  file: File,
  businessId: string
): Promise<string> => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `users/${businessId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the URL to Firestore
    const businessDoc = doc(db, "businesses", businessId);
    await updateDoc(businessDoc, {
      photos: arrayUnion(downloadURL),
    });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const uploadPhotoForPackage = async (file: File): Promise<string> => {
  try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `packages/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
  } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
  }
};

export const saveNumberOfImages = async (count: number) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User is not authenticated.");
  }

  const businessId = currentUser.uid; // Get the authenticated user's ID
  const businessDoc = doc(db, "businesses", businessId);

  try {
    await updateDoc(businessDoc, { numberOfImages: count });
    console.log(`Successfully updated numberOfImages to ${count}`);
  } catch (error) {
    console.error("Error updating numberOfImages:", error);
    throw new Error("Failed to update numberOfImages in Firestore.");
  }
};

export const fetchCompanies = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "businesses"));
    return querySnapshot.docs.map((doc) => ({
      $id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const fetchShowcasingBusinessData = async (
  businessId: string
): Promise<ShowcasingBusinessData> => {
  try {
    const businessDocRef = doc(db, "businesses", businessId);
    const businessDoc = await getDoc(businessDocRef);

    if (!businessDoc.exists()) {
      throw new Error("Business document not found.");
    }

    const businessData = businessDoc.data() as BusinessData;

    // Fetch settings using settingsId
    const settingsId = businessData.settingsId;
    const settings = await fetchSettings(settingsId) as SettingsData;

    return {
      ...businessData,
      settings, // Include settings
    };
  } catch (error) {
    console.error("Error fetching business data:", error);
    throw error;
  }
};

export const saveSettings = async (settings: Record<string, boolean | number>) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User is not authenticated.");
    }

    const authId = currentUser.uid;

    const businessDocRef = doc(db, "businesses", authId);
    const businessDoc = await getDoc(businessDocRef);

    if (!businessDoc.exists()) {
      throw new Error("No business found for the given authId.");
    }

    const businessId = authId;

    const settingsDocRef = doc(db, "settings", `${businessId}-settings`);

    // Create or update the settings document
    await setDoc(settingsDocRef, settings, { merge: true });

    // Link the settings document in the businesses collection
    await updateDoc(businessDocRef, { settingsId: `${businessId}-settings` });

    console.log("Settings saved successfully.");
  } catch (error) {
    console.error("Error saving settings:", error);
    throw new Error("Failed to save settings.");
  }
};

export const fetchSettings = async (settingsId: string) => {
  try {
    // Reference the settings document
    const settingsDocRef = doc(db, "settings", settingsId);
    const settingsDoc = await getDoc(settingsDocRef);

    // Check if the document exists
    if (!settingsDoc.exists()) {
      throw new Error("Settings document not found.");
    }

    // Return the settings data
    return settingsDoc.data();
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const fetchShowcasingBusinessPackages = async (
  businessId: string
): Promise<Package[]> => {
  try {
    // Fetch the business document
    const businessDoc = await getDoc(doc(db, "businesses", businessId));

    if (!businessDoc.exists()) {
      throw new Error("Business not found.");
    }

    // Retrieve package IDs from the business document
    const packageIds: string[] = businessDoc.data().packages || [];

    // Fetch all package documents associated with the IDs
    const packagePromises = packageIds.map(async (id) => {
      const packageDoc = await getDoc(doc(db, "packages", id));
      if (!packageDoc.exists()) {
        return null;
      }

      const packageData = packageDoc.data();
      return {
        id: packageDoc.id,
        amount: packageData.amount || 0,
        status: packageData.status || false,
        capacity: packageData.capacity || 0,
        title: packageData.title || "package",
        per: packageData.per || "person",
        what: packageData.what || "",
        time: packageData.time || "",
        included: packageData.included || "",
        total: packageData.total || "",
        bring: packageData.bring || "",
      } as Package;
    });

    // Resolve all package promises and filter out null values
    const packages = (await Promise.all(packagePromises)).filter(
      (pkg) => pkg !== null
    ) as Package[];

    return packages;
  } catch (error) {
    console.error("Error fetching business packages:", error);
    throw error;
  }
};