const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
} = require("firebase/firestore");

// 🔐 Paste your actual config here
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔁 Add any collection names you want to inspect here
const COLLECTIONS = ["bookings", "businesses", "users"];

async function printCollections() {
  for (const name of COLLECTIONS) {
    console.log(`📂 Collection: ${name}`);
    const colRef = collection(db, name);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      console.log("  (No documents found)");
      continue;
    }

    snapshot.forEach((doc) => {
      console.log(`  📄 ${doc.id}:`, doc.data());
    });
  }
}

printCollections().catch(console.error);
