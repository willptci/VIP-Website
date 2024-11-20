"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLoggedInUser, getUserInfo, logout, updateUserProfile, uploadProfileImage } from '@/lib/actions/user.actions';
import Link from 'next/link';
import { createAdminClient } from '@/lib/appwrite';

// Utility function to get profile image URL
const getProfileImageUrl = async (fileId: string) => {
    const { storage } = await createAdminClient();
    const baseUrl = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    return `${baseUrl}/storage/buckets/${process.env.APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/view`;
};

// Reusable ProfileField component
const ProfileField = ({ label, value, placeholder, type = "text", onBlur }: any) => (
    <div className="pl-10 pb-5 pr-10">
        <p className="ml-4 text-lg font-medium mb-1">{label}</p>
        {value ? (
            <p>{value}</p>
        ) : (
            <Input type={type} placeholder={placeholder} onBlur={(e) => onBlur(e.target.value)} />
        )}
    </div>
);

const ProfileComponent = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = await getLoggedInUser();
                if (!loggedInUser) return setLoading(false);

                const userInfo = await getUserInfo({ userId: loggedInUser.$id });
                setUserData(userInfo);

                if (userInfo?.profileImageId) {
                    const url = await getProfileImageUrl(userInfo.profileImageId);
                    setProfileImageUrl(url);
                }
            } catch (error) {
                console.error("Error loading user information:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFieldUpdate = async (field: keyof User, value: string) => {
        try {
            if (!userData) return;
            const updatedUser = await updateUserProfile(userData.$id, { [field]: value });
            if (updatedUser) {
                setUserData((prev) => ({ ...prev!, [field]: updatedUser[field] }));
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file || !userData) return;

    //     try {
    //         const fileId = await uploadProfileImage(file);
    //         await updateUserProfile(userData.$id, { profileImageId: fileId });

    //         setUserData((prev) => ({ ...prev!, profileImageId: fileId }) as User);
    //         const url = await getProfileImageUrl(fileId);
    //         setProfileImageUrl(url);
    //     } catch (error) {
    //         console.error("Error uploading image:", error);
    //     }
    // };

    const handleLogout = async () => {
        await logout();
        setUserData(null);
    };

    if (loading) return <p className="ml-20 text-lg">Loading...</p>;

    if (!userData) {
        return (
            <p className="ml-20 text-lg">
                Please <Link href="/sign-in" className="text-blue-500 hover:underline">log in</Link> to access your profile details.
            </p>
        );
    }

    return (
        <div className="ml-40 mt-16">
            <section className="flex items-start gap-20">
                {/* Profile Image Section */}
                <div>
                    <Avatar>
                        <AvatarImage src={profileImageUrl || "/icons/user.svg"} alt="profile" />
                        <AvatarFallback>PROFILE</AvatarFallback>
                    </Avatar>
                    <div className="flex justify-center">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Upload Image
                        </button>
                    </div>
                    {/* <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                    /> */}
                </div>

                {/* User Info Section */}
                <div>
                    <div className="flex gap-20 pl-10 pb-5 pr-10">
                        <ProfileField
                            label="First Name"
                            value={userData.firstName}
                            placeholder="First Name"
                            onBlur={(value: string) => handleFieldUpdate("firstName", value)}
                        />
                        <ProfileField
                            label="Last Name"
                            value={userData.lastName}
                            placeholder="Last Name"
                            onBlur={(value: string) => handleFieldUpdate("lastName", value)}
                        />
                    </div>

                    <div className="flex gap-20 p-10">
                        <ProfileField label="Email" value={userData.email} placeholder="" />
                        <ProfileField
                            label="Telephone"
                            value={userData.telephone}
                            placeholder="+1 (123) 456-7890"
                            type="tel"
                            onBlur={(value: string) => handleFieldUpdate("telephone", value)}
                        />
                    </div>

                    <div className="pl-10 pb-5 pr-10">
                        <p className="ml-4 text-lg font-medium mb-1">Description</p>
                        {userData.description ? (
                            <p>{userData.description}</p>
                        ) : (
                            <Textarea
                                placeholder="Describe what you're excited to do in Andros and what you're looking for in a trip!"
                                onBlur={(e) => handleFieldUpdate("description", e.target.value)}
                            />
                        )}
                    </div>
                </div>
            </section>

            <div className="mt-8 ml-20">
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default ProfileComponent;
