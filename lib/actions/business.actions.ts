import { doc, setDoc, updateDoc, getDoc, getDocs, query, where, collection, addDoc, arrayUnion, orderBy, limit } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { BusinessData, Package, SettingsData, ShowcasingBusinessData } from "@/types";
import { storage } from "@/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const getBusinessId = () => {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  console.log("Business ID:", user.uid)
  return user.uid
}

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
        ...data,
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

    const businessRef = doc(db, "businesses", businessId);
    await updateDoc(businessRef, {
      packages: arrayUnion(packageId),
    });

    console.log("Package document created with ID:", packageId);

    return {
      id: packageId,
      ...completePackageData,
    } as Package;
  } catch (error) {
    console.error("Error adding package to Firestore:", error);
    throw error;
  }
};

const convertToJPG = async (file: File) => {
  if (file.type === "image/heic" || file.name.endsWith(".heic")) {
    const heic2any = (await import("heic2any")).default;
    const blob = await heic2any({ blob: file, toType: "image/jpeg" });
    return new File([blob as Blob], file.name.replace(".heic", ".jpg"), {
      type: "image/jpeg",
    });
  }
  return file;
};

export const uploadPhotoForBusiness = async (
  file: File,
  businessId: string
): Promise<string> => {
  try {
    const convertedFile = await convertToJPG(file); // Convert HEIC to JPG
    const fileName = `${Date.now()}_${convertedFile.name}`; // Ensure unique filename
    const storageRef = ref(storage, `users/${businessId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, convertedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the URL to Firestore under `businesses/{businessId}`
    const businessDoc = doc(db, "businesses", businessId);
    await updateDoc(businessDoc, {
      photos: arrayUnion(downloadURL), // Adds new photo without overwriting existing ones
    });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

// export const uploadPhotoForBusiness = async (
//   file: File,
//   businessId: string
// ): Promise<string> => {
//   try {
//     const fileName = `${Date.now()}_${file.name}`;
//     const storageRef = ref(storage, `users/${businessId}/${fileName}`);
//     const snapshot = await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(snapshot.ref);

//     // Save the URL to Firestore
//     const businessDoc = doc(db, "businesses", businessId);
//     await updateDoc(businessDoc, {
//       photos: arrayUnion(downloadURL),
//     });

//     return downloadURL;
//   } catch (error) {
//     console.error("Error uploading photo:", error);
//     throw error;
//   }
// };

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

  const businessId = currentUser.uid;
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
        photos: packageData.photos || [],
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

// export const saveOpenHours = async (
//   openSelectedDays: string[],
//   openHours: { start: string; end: string },
//   unavailableTimes: { start: string; end: string }[]
// ) => {
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   if (!currentUser) {
//     throw new Error("User is not authenticated. Unable to save schedule.");
//   }

//   const businessId = currentUser.uid

//   const payload = {
//     selectedDays: openSelectedDays,
//     start: openHours.start,
//     end: openHours.end,
//     unavailableTimes
//   }

//   console.log("Open hours", payload)

//   try {
//     await setDoc(doc(db, "businesses", businessId), { openHours: payload }, { merge: true })
//     console.log("Open hours saved successfully!")
//     console.log(currentUser)
//   } catch (error) {
//     console.error("Error saving open hours:", error)
//   }
// }

// export const saveFixedSlots = async (
//   fixedSelectedDays: string[],
//   fixedBlockedTimes: { start: string; end: string; allowedPackages: string[] }[]
// ) => {
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   if (!currentUser) {
//     throw new Error("User is not authenticated. Unable to save schedule.");
//   }

//   const businessId = currentUser.uid

//   const payload = {
//     selectedDays: fixedSelectedDays,
//     blockedSlots: fixedBlockedTimes
//   }

//   console.log("Fixed Slots", payload)

//   try {
//     await setDoc(doc(db, "businesses", businessId), { fixedSlots: payload }, { merge: true })
//     console.log("Fixed slots saved successfully!")
//   } catch (error) {
//     console.error("Error saving fixed slots:", error)
//   }
// }

export const saveOpenHours = async (
  openSelectedDays: string[],
  openHours: { start: string; end: string },
  unavailableTimes: { start: string; end: string }[]
) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User is not authenticated. Unable to save schedule.");
  }

  const businessId = currentUser.uid;
  const docRef = doc(db, "businesses", businessId);

  try {
    const docSnap = await getDoc(docRef);
    let existingData = docSnap.exists() ? docSnap.data() : { openHours: [], fixedSlots: [] };

    // 🔹 Remove conflicting days from BOTH openHours and fixedSlots
    const updatedOpenHours = existingData.openHours.filter(
      (schedule: any) => !openSelectedDays.some(day => schedule.selectedDays.includes(day))
    );
    const updatedFixedSlots = existingData.fixedSlots.filter(
      (slot: any) => !openSelectedDays.some(day => slot.selectedDays.includes(day))
    );

    // 🔹 Add the new open hours
    updatedOpenHours.push({
      selectedDays: openSelectedDays,
      start: openHours.start,
      end: openHours.end,
      unavailableTimes,
    });

    // 🔹 Save to Firestore
    await setDoc(docRef, { openHours: updatedOpenHours, fixedSlots: updatedFixedSlots }, { merge: true });

  } catch (error) {
    console.error("Error saving open hours:", error);
  }
};

export const saveFixedSlots = async (
  fixedSelectedDays: string[],
  fixedBlockedTimes: { start: string; end: string; allowedPackages: string[] }[]
) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User is not authenticated. Unable to save schedule.");
  }

  const businessId = currentUser.uid;
  const docRef = doc(db, "businesses", businessId);

  try {
    const docSnap = await getDoc(docRef);
    let existingData = docSnap.exists() ? docSnap.data() : { openHours: [], fixedSlots: [] };

    // 🔹 Remove conflicting days from BOTH fixedSlots and openHours
    const updatedFixedSlots = existingData.fixedSlots.filter(
      (slot: any) => !fixedSelectedDays.some(day => slot.selectedDays.includes(day))
    );
    const updatedOpenHours = existingData.openHours.filter(
      (schedule: any) => !fixedSelectedDays.some(day => schedule.selectedDays.includes(day))
    );

    // 🔹 Add the new fixed slots
    updatedFixedSlots.push({
      selectedDays: fixedSelectedDays,
      blockedSlots: fixedBlockedTimes,
    });

    // 🔹 Save to Firestore
    await setDoc(docRef, { fixedSlots: updatedFixedSlots, openHours: updatedOpenHours }, { merge: true });

  } catch (error) {
    console.error("Error saving fixed slots:", error);
  }
};

export const checkAndSaveOpenHours = async (
  openSelectedDays: string[],
  openHours: { start: string; end: string },
  unavailableTimes: { start: string; end: string }[]
): Promise<{ exists: boolean }> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User is not authenticated. Unable to save schedule.");
  }

  const businessId = currentUser.uid;
  const docRef = doc(db, "businesses", businessId);

  try {
    const docSnap = await getDoc(docRef);
    let existingData = docSnap.exists() ? docSnap.data() : { openHours: [], fixedSlots: [] };

    // 🔹 Check if the selected days exist in either `openHours` or `fixedSlots`
    const existingOpenDays = existingData.openHours.filter((schedule: any) =>
      openSelectedDays.some((day) => schedule.selectedDays.includes(day))
    );
    const existingFixedDays = existingData.fixedSlots.filter((slot: any) =>
      openSelectedDays.some((day) => slot.selectedDays.includes(day))
    );

    if (existingOpenDays.length > 0 || existingFixedDays.length > 0) {
      return { exists: true }; // Indicate overwrite needed
    }

    // 🔹 If no conflicts, just add the schedule
    const updatedOpenHours = [
      ...existingData.openHours,
      {
        selectedDays: openSelectedDays,
        start: openHours.start,
        end: openHours.end,
        unavailableTimes,
      },
    ];

    await setDoc(docRef, { openHours: updatedOpenHours }, { merge: true });

    return { exists: false };
  } catch (error) {
    console.error("Error saving open hours:", error);
    throw error;
  }
};

export const checkAndSaveFixedSlots = async (
  fixedSelectedDays: string[],
  fixedBlockedTimes: { start: string; end: string; allowedPackages: string[] }[]
): Promise<{ exists: boolean }> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User is not authenticated. Unable to save schedule.");
  }

  const businessId = currentUser.uid;
  const docRef = doc(db, "businesses", businessId);

  try {
    const docSnap = await getDoc(docRef);
    let existingData = docSnap.exists() ? docSnap.data() : { openHours: [], fixedSlots: [] };

    // 🔹 Check if the selected days exist in either `openHours` or `fixedSlots`
    const existingFixedDays = existingData.fixedSlots.filter((slot: any) =>
      fixedSelectedDays.some((day) => slot.selectedDays.includes(day))
    );
    const existingOpenDays = existingData.openHours.filter((schedule: any) =>
      fixedSelectedDays.some((day) => schedule.selectedDays.includes(day))
    );

    if (existingFixedDays.length > 0 || existingOpenDays.length > 0) {
      return { exists: true }; // Indicate overwrite needed
    }

    // 🔹 If no conflicts, just add the schedule
    const updatedFixedSlots = [
      ...existingData.fixedSlots,
      {
        selectedDays: fixedSelectedDays,
        blockedSlots: fixedBlockedTimes,
      },
    ];

    await setDoc(docRef, { fixedSlots: updatedFixedSlots }, { merge: true });

    return { exists: false };
  } catch (error) {
    console.error("Error saving fixed slots:", error);
    throw error;
  }
};

type OpenHours = {
  selectedDays: string[];
  start: string;
  end: string;
  unavailableTimes: { start: string; end: string }[];
};

type FixedSlot = {
  start: string;
  end: string;
  allowedPackages: string[];
};

type FixedSlots = {
  selectedDays: string[];
  blockedSlots: FixedSlot[];
};

type Schedule = {
  openHours: OpenHours | null;
  fixedSlots: FixedSlots | null;
};

export const fetchBusinessSchedule = async (): Promise<{ openHours: OpenHours[]; fixedSlots: FixedSlots[] }> => {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("No authenticated user found.");
        reject(new Error("User is not authenticated. Unable to fetch schedule."));
        return;
      }

      try {
        const businessId = user.uid;

        const docRef = doc(db, "businesses", businessId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.warn("No schedule found, returning defaults.");
          resolve({ openHours: [], fixedSlots: [] });
          return;
        }

        const data = docSnap.data();

        resolve({
          openHours: Array.isArray(data.openHours) ? data.openHours : [],
          fixedSlots: Array.isArray(data.fixedSlots) ? data.fixedSlots : [],
        });
      } catch (error) {
        console.error("Error fetching schedule:", error);
        reject(error);
      }
    });
  });
};

export const fetchPackages = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) return;

  const businessId = currentUser.uid;
  const docRef = doc(db, "businesses", businessId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.packages && Array.isArray(data.packages)) {
      return data.packages;
    }
  }
};

export const saveBooking = async (
  title: string,
  date: string,
  time: string,
  adults: number,
  children: number,
  infants: number,
  totalPrice: number,
  businessId: string,
  businessName: string,
  totalDuration: number,
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to book a trip.");
  }

  const userId = user.uid;

  const bookingDetails = {
    title,
    date,
    time,
    guests: { adults, children, infants },
    totalPrice,
    userId,
    businessId,
    businessName,
    totalDuration,
  };

  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      upcomingTrips: arrayUnion(bookingDetails),
    });

    const businessDocRef = doc(db, "businesses", businessId);
    await updateDoc(businessDocRef, {
      upcomingBookings: arrayUnion(bookingDetails),
    });

  } catch (error) {
    console.error("Error saving booking:", error);
    throw error;
  }
};

// export const fetchBusinessUpcomingBookings = async () => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) throw new Error("User not authenticated.");

//   try {
//     const businessRef = doc(db, "businesses", user.uid);
//     const businessSnap = await getDoc(businessRef);

//     if (!businessSnap.exists()) return [];

//     const businessData = businessSnap.data();
//     return businessData.upcomingBookings
//       ? businessData.upcomingBookings.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
//       : [];
//   } catch (error) {
//     console.error("Error fetching upcoming bookings:", error);
//     throw error;
//   }
// };

type Booking = {
  businessId: string;
  date: string;
  guests: { infants: number; adults: number; children: number };
  time: string;
  title: string;
  totalPrice: number;
  userId: string;
  totalDuration: number;
};

export const fetchBusinessUpcomingBookings = async (): Promise<Booking[]> => {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        reject(new Error("User not authenticated."));
        return;
      }

      try {
        const businessRef = doc(db, "businesses", user.uid);
        const businessSnap = await getDoc(businessRef);

        if (!businessSnap.exists()) {
          console.warn("No business data found.");
          resolve([]);
          return;
        }

        const businessData = businessSnap.data();
        if (!businessData || !businessData.upcomingBookings) {
          console.warn("No upcoming bookings found.");
          resolve([]);
          return;
        }

        resolve(
          businessData.upcomingBookings.sort(
            (a: Booking, b: Booking) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
        reject(error);
      }
    });
  });
};

export const fetchBusinessPastBookings = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated.");

  try {
    const businessRef = doc(db, "businesses", user.uid);
    const businessSnap = await getDoc(businessRef);

    if (!businessSnap.exists()) return [];

    const businessData = businessSnap.data();
    const now = new Date();

    return businessData.upcomingBookings
      ? businessData.upcomingBookings
          .filter((booking: any) => new Date(booking.date).getTime() < now.getTime())
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [];
  } catch (error) {
    console.error("Error fetching past bookings:", error);
    throw error;
  }
};

export const fetchTopReviews = async (businessId: string) => {
  try {
    console.log(`Fetching reviews for businessId: ${businessId}`);

    const businessRef = doc(db, "businesses", businessId);
    const businessSnap = await getDoc(businessRef);

    if (!businessSnap.exists()) {
      console.error("No business found.");
      return [];
    }

    const businessData = businessSnap.data();
    const reviews = businessData.reviews || [];

    console.log("Fetched Reviews:", reviews);

    return reviews.slice(0, 5);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};