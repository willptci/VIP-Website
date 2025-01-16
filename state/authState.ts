import { create } from "zustand";

type UserRole = "guest" | "user" | "business";

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: "guest",
  setRole: (role) => set({ role }),
}));
