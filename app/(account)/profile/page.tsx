"use client";

import UserProfilePage from "@/components/ui/UserProfilePage";
import SignInPrompt from "@/components/ui/SignInPrompt";
import { useAuthStore } from "@/state/authState";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isHydrating = useAuthStore((state) => state.isHydrating);

  console.log("User:", user);
  console.log("Role:", role);
  console.log("Is Hydrating:", isHydrating);

  if (isHydrating)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );

  if (!user || role === "guest") {
    return <SignInPrompt />;
  }

  return <UserProfilePage />
  // return role === "business" ? <BusinessProfilePage /> : <UserProfilePage />;
};

export default Profile;
