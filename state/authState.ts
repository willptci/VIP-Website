// import { create } from 'zustand';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/firebase/firebaseConfig';

// type UserRole = 'guest' | 'user' | 'business';

// interface AuthUser {
//   uid: string;
//   email: string;
// }

// interface AuthState {
//   user: AuthUser | null;
//   role: UserRole;
//   isHydrating: boolean;
//   setUser: (user: AuthUser | null) => void;
//   setRole: (role: UserRole) => void;
//   setIsHydrating: (isHydrating: boolean) => void;
//   hydrateAuth: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   role: 'guest',
//   isHydrating: true,
//   setUser: (user) => set({ user }),
//   setRole: (role) => set({ role }),
//   setIsHydrating: (isHydrating) => set({ isHydrating }),

//   hydrateAuth: async () => {
//     set({ isHydrating: true });

//     const auth = getAuth();

//     return new Promise<void>((resolve) => {
//       const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//         if (currentUser) {
//           try {
//             const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
//               set({
//                 user: { uid: currentUser.uid, email: currentUser.email || '' },
//                 role: userData.role as UserRole,
//               });
//             } else {
//               set({ user: null, role: 'guest' });
//             }
//           } catch (error) {
//             console.error('Error fetching user data:', error);
//             set({ user: null, role: 'guest' });
//           }
//         } else {
//           set({ user: null, role: 'guest' });
//         }

//         set({ isHydrating: false });
//         unsubscribe();
//         resolve();
//       });
//     });
//   },
// }));

import { create } from "zustand";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

type UserRole = "guest" | "user" | "business";

interface AuthUser {
  uid: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  role: UserRole;
  isHydrating: boolean;
  setUser: (user: AuthUser | null) => void;
  setRole: (role: UserRole) => void;
  setIsHydrating: (isHydrating: boolean) => void;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: "guest",
  isHydrating: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setIsHydrating: (isHydrating) => set({ isHydrating }),

  hydrateAuth: async () => {
    set({ isHydrating: true });

    const auth = getAuth();

    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              set({
                user: { uid: currentUser.uid, email: currentUser.email || "" },
                role: (userData.role as UserRole) || "user", // Default to 'user'
              });
            } else {
              set({ user: null, role: "guest" });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            set({ user: null, role: "guest" });
          }
        } else {
          set({ user: null, role: "guest" });
        }

        set({ isHydrating: false });
        resolve();
      });

      // Keep the auth listener alive so it tracks changes
      return () => unsubscribe();
    });
  },
}));