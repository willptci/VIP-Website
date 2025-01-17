import { doc, setDoc, updateDoc, getDoc, getDocs, query, where, collection, addDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { Package } from "@/types";

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
    const docRef = doc(db, "businesses", businessId); // Fetch the document using the UID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Business data fetched successfully:", docSnap.data());
      return docSnap.data(); // Return the document data
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

// export const addPackageToFirestore = async (packageData: Record<string, any>) => {
//   try {
//     // Step 1: Get the authenticated user's UID
//     const auth = getAuth();
//     const currentUser = auth.currentUser;

//     if (!currentUser) {
//       throw new Error("User is not authenticated. Unable to create package.");
//     }

//     const businessId = currentUser.uid; // Use UID as the business document ID

//     // Step 2: Create a new package document in the `packages` collection
//     const packageId = `${businessId}_${Date.now()}`; // Unique ID for the package
//     const packageRef = doc(db, "packages", packageId);

//     const completePackageData = {
//       ...packageData,
//       createdAt: new Date().toISOString(),
//     };

//     await setDoc(packageRef, completePackageData);
//     console.log("Package document created with ID:", packageId);

//     // Step 3: Add the package ID to the `packages` array in the business document
//     const businessRef = doc(db, "businesses", businessId);
//     await updateDoc(businessRef, {
//       packages: arrayUnion(packageId),
//     });
//     console.log(`Package ID ${packageId} added to business ${businessId}`);

//     return packageId; // Return the created package ID
//   } catch (error) {
//     console.error("Error adding package to Firestore:", error);
//     throw error;
//   }
// };

export const addPackageToFirestore = async (packageData: Record<string, any>): Promise<Package> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User is not authenticated. Unable to create package.");
    }

    const businessId = currentUser.uid;
    const packageId = `${businessId}_${Date.now()}`; // Unique ID for the package
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