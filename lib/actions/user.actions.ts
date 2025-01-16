import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, firebaseConfig, db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const signIn = async ({ email, password }: { email: string; password: string }) => {

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

export const signUp = async ({ email, password }: { email: string; password: string }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User signed up:", user);
    return user;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const addBusinessToFirestore = async (businessData: Record<string, any>) => {
  try {
    const docRef = await addDoc(collection(db, "businesses"), businessData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
  const user = auth.currentUser;

  if (user) {
    try {
      await updateProfile(user, profileData);
      console.log("User profile updated:", user);
      return user;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  } else {
    console.warn("No user is currently logged in.");
  }
};

// export const setCustomClaims = async (uid: string, claims: { business?: boolean }) => {
//   try {
//     await getAuth().setCustomUserClaims(uid, claims);
//     console.log("Custom claims set for user:", uid);
//   } catch (error) {
//     console.error("Error setting custom claims:", error);
//     throw error;
//   }
// };

// export async function getLoggedInUser() {
//     try {
//       const { account } = await createSessionClient();
//       const user = await account.get();
  
//       //const user = await getUserInfo({ userId: result.$id})
  
//       return parseStringify(user);
//     } catch (error) {
//       console.log(error)
//       return null;
//     }
//   }

//   export const getUserInfo = async ({ userId }: getUserInfoProps) => {
//     try {
//       const { database } = await createAdminClient();
  
//       const user = await database.listDocuments(
//         DATABASE_ID!,
//         USER_COLLECTION_ID!,
//         [Query.equal('userId', [userId])]
//       )
  
//       return parseStringify(user.documents[0]);
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   export const updateUserProfile = async (documentId: string, profileData: Partial<User>): Promise<User | null> => {
//     try {
//         const { database } = await createAdminClient();

//         const updatedProfile = await database.updateDocument(
//             DATABASE_ID!,
//             USER_COLLECTION_ID!,
//             documentId,
//             profileData
//         );

//         console.log("Updated profile data:", updatedProfile);
//         return parseStringify(updatedProfile) as User;
//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         return null;
//     }
// };

// export const logout = async () => {
//   const setRole = useAuthStore((state) => state.setRole);
//   try {
//       const { account } = await createSessionClient();
//       cookies().delete('appwrite-sesssion');
//       await account.deleteSession('current');
//       setRole("guest");
//       console.log("User logged out successfully");
//   } catch (error) {
//       console.error("Error logging out:", error);
//   }
// };

// export const uploadProfileImage = async (file: File): Promise<string | null> => {
//   try {
//       const { storage } = await createAdminClient();

//       const response = await storage.createFile(
//           PROFILE_STORAGE_BUCKET_ID!,
//           ID.unique(),
//           file
//       );

//       console.log("Uploaded image file:", response);
//       return response.$id;
//   } catch (error) {
//       console.error("Error uploading profile image:", error);
//       return null;
//   }
// };

// export const createBusiness = async (userData: Business) => {
//   const { companyName, firstName, lastName, preferredContact, description, charges, offer } = userData;

//   try {
//     const { account, database } = await createAdminClient();


//     const user = await getLoggedInUser();
//     if (!user || !user.$id) {
//       throw new Error('User is not logged in or userId is missing');
//     }

//     console.log("User ID:", user.$id);

//     const businessId = ID.unique();

//     // Create the new business document
//     const newBusiness = await database.createDocument(
//       DATABASE_ID!,
//       BUSINESS_COLLECTION_ID!,
//       businessId,
//       {
//         businessId,
//         companyName,
//         firstName,
//         lastName,
//         preferredContact,
//         description,
//         charges,
//         offer,
//       }
//     );

//     // Update the user's profile with the new business ID
//     const updatedUser = await updateUserProfile(user.$id, { businessId });
//     if (!updatedUser) {
//       throw new Error('Failed to update user profile with business ID');
//     }

//     return JSON.stringify({ newBusiness, updatedUser });
//   } catch (error) {
//     console.error('Error creating business document:', error);
//     throw new Error('Failed to create business document');
//   }
// };

// export const updateBusiness = async (businessId: string, businessData: Partial<Business>): Promise<Business | null> => {
//   try {
//     const { database } = await createAdminClient();

//     const updatedBusiness = await database.updateDocument(
//       DATABASE_ID!,
//       BUSINESS_COLLECTION_ID!,
//       businessId,
//       businessData
//     );

//     console.log("Updated business data:", updatedBusiness);
//     return parseStringify(updatedBusiness) as Business;
//   } catch (error) {
//     console.error("Error updating business:", error);
//     return null;
//   }
// };

// export const getUserBusiness = async (): Promise<Business | null> => {
//   try {
//     const { database } = await createAdminClient();

//     // Step 1: Get the logged-in user
//     const user = await getLoggedInUser();
//     if (!user) {
//       console.warn("No logged-in user found.");
//       return null;
//     }

//     // Step 2: Fetch additional user info, including businessId
//     const fullUserInfo = await getUserInfo({ userId: user.$id });
//     if (!fullUserInfo || !fullUserInfo.businessId) {
//       console.warn("User does not have an associated business.");
//       return null;
//     }

//     // Step 3: Fetch the business document using businessId
//     const business = await database.getDocument(
//       DATABASE_ID!,
//       BUSINESS_COLLECTION_ID!,
//       fullUserInfo.businessId
//     );

//     console.log("Fetched business:", business);
//     return parseStringify(business) as Business;
//   } catch (error) {
//     console.error("Error fetching user business:", error);
//     return null;
//   }
// };

// export const fetchCompanies = async (): Promise<CompanyDocument[]> => {

//   if (!DATABASE_ID || !BUSINESS_COLLECTION_ID) {
//     throw new Error("Environment variables for database or collection ID are missing.");
//   }

//   try {
//     const { database } = await createAdminClient();
//     const response = await database.listDocuments(DATABASE_ID, BUSINESS_COLLECTION_ID);

//     //console.log("company image", response.documents[2].images);

//     return response.documents.map((doc: any) => ({
//       $id: doc.$id,
//       companyName: doc.companyName ?? "Unknown",
//       firstName: doc.firstName ?? "Unknown",
//       lastName: doc.lastName ?? "Unknown",
//       image: doc.images && doc.images.length > 0 ? doc.images[0] : "Unknown",
//     }));
//   } catch (error) {
//     console.error("Error fetching companies:", error);
//     throw new Error("Failed to fetch companies");
//   }
// };

// export const generateImageUrl = (fileId: string): string => {

//   return `${ENDPOINT}/storage/buckets/${BUSINESS_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${PROJECT}&project=${PROJECT}&mode=admin`;
// };

// export const uploadImageToAppwrite = async (file: File): Promise<string> => {
//   const { storage } = await createAdminClient();
//   const { account } = await createSessionClient();
//   const user = await account.get();
  

//   try {
//     const response = await storage.createFile(
//       BUSINESS_STORAGE_BUCKET_ID!,
//       ID.unique(),
//       file,
//       [
//         Permission.read(Role.any()),
//         Permission.update(Role.user(user.$id)), 
//       ]
//     );

//     return response.$id; 
//   } catch (error) {
//     console.error("Error uploading image to Appwrite:", error);
//     throw new Error("Failed to upload image to Appwrite");
//   }
// };
