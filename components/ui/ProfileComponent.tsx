"use client";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLoggedInUser, getUserInfo, logout, updateUserProfile, uploadProfileImage } from "@/lib/actions/user.actions";
import Link from "next/link";

// Reusable ProfileField component
const ProfileField = ({ label, value, placeholder, type = "text", onBlur }: any) => (
  <div className="pl-10 pb-5 pr-10">
    <p className="ml-4 text-lg font-medium mb-1">{label}</p>
    {value ? <p>{value}</p> : <Input type={type} placeholder={placeholder} onBlur={(e) => onBlur(e.target.value)} />}
  </div>
);

const ProfileComponent = () => {
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getLoggedInUser();
        if (!user) return setLoading(false);

        const userInfo = await getUserInfo(user.uid);
        setUserData(userInfo);
        setProfileImageUrl(userInfo?.profileImageUrl || "/icons/user.svg");
      } catch (error) {
        console.error("Error loading user information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFieldUpdate = async (field: keyof any, value: string) => {
    if (!userData) return;
    await updateUserProfile(userData.uid, { [field]: value });
    setUserData((prev: any) => ({ ...prev!, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userData) return;
    
    const url = await uploadProfileImage(file, userData.uid);
    setProfileImageUrl(url);
    setUserData((prev: any) => ({ ...prev!, profileImageUrl: url }));
  };

  const handleLogout = async () => {
    await logout();
    setUserData(null);
  };

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Please <Link href="/sign-in">log in</Link> to access your profile.</p>;

  return (
    <div className="ml-40 mt-16">
      <section className="flex items-start gap-20">
        <div>
          <Avatar>
            <AvatarImage src={profileImageUrl || "/icons/user.svg"} alt="profile" />
            <AvatarFallback>PROFILE</AvatarFallback>
          </Avatar>
          <button onClick={() => fileInputRef.current?.click()} className="bg-blue-500 text-white px-4 py-2 rounded">Upload Image</button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} hidden />
        </div>

        <ProfileField label="First Name" value={userData.firstName} placeholder="First Name" onBlur={(value: string) => handleFieldUpdate("firstName", value)} />
      </section>

      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Log Out</button>
    </div>
  );
};

export default ProfileComponent;