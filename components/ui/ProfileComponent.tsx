"use client";
import React, { useEffect, useRef, useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getLoggedInUser, getUserInfo, logout, updateUserProfile, uploadProfileImage } from '@/lib/actions/user.actions';
import Link from 'next/link';
import { parseStringify } from '@/lib/utils';
import { createAdminClient } from '@/lib/appwrite';

const ProfileComponent = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const loggedInUser = await getLoggedInUser();
            const userInfo = await getUserInfo({ userId: loggedInUser.$id });
            setUserData(userInfo);
            setLoading(false);

            if (userInfo?.profileImageId) {
                const url = await getProfileImageUrl(userInfo.profileImageId);
                setProfileImageUrl(url);
            }
        };
        fetchData();
    }, []);

    
    const handleFieldUpdate = async (field: keyof User, value: string) => {
        if (userData) {
            try {
                const updatedUser = await updateUserProfile(userData.$id, { [field]: value });
                if (updatedUser) {
                    setUserData((prevUserData) => ({
                        ...prevUserData!,
                        [field]: updatedUser[field],
                    }));
                    console.log("Successfully updated user data:", updatedUser);
                }
            } catch (error) {
                console.error(`Error updating ${field}:`, error);
            }
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && userData) {
            const fileId = await uploadProfileImage(file);
            if (fileId) {
                await updateUserProfile(userData.$id, { profileImageId: fileId });
                setUserData((prev) => ({ ...prev!, profileImageId: fileId }) as User);

                const url = await getProfileImageUrl(fileId);
                setProfileImageUrl(url);
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
        console.log("click")
    };

    const handleLogout = async () => {
        await logout();
        setUserData(null);
    };

    const getProfileImageUrl = async (fileId: string) => {
        const { storage } = await createAdminClient();
        const baseUrl = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        return `${baseUrl}/storage/buckets/${process.env.APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/view`;
    };

    return (
        <div className="ml-40 mt-16">

            <h1 className="text-5xl font-bold mb-12 ml-20">
                {userData ? (
                    "Profile"
                ) : (
                    <Link href="/sign-in" className="text-blue-500 hover:underline">
                        Please Log In Here
                    </Link>
                )}
            </h1>
            
            {userData ? (
                <section className="flex items-start gap-20">
                    <div>
                        <Avatar>
                            <AvatarImage src={ profileImageUrl || "/icons/user.svg" } alt="profile" />
                            <AvatarFallback>
                                PROFILE
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex justify-center">
                            <button
                                onClick={handleButtonClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Upload Image
                            </button>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                        />
                    </div>
                    <div>
                        <div className="flex gap-20 pl-10 pb-5 pr-10">
                            {/* First Name */}
                            <div className="pl-10 pb-5 pr-10">
                                <p className="ml-4 text-lg font-medium mb-1">First Name</p>
                                {userData.firstName ? (
                                    <p>{userData.firstName}</p>
                                ) : (
                                    <Input
                                        type="text"
                                        placeholder="First Name"
                                        onBlur={(e) => handleFieldUpdate("firstName", e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="pl-10 pb-5 pr-10">
                                <p className="ml-4 text-lg font-medium mb-1">Last Name</p>
                                {userData.lastName ? (
                                    <p>{userData.lastName}</p>
                                ) : (
                                    <Input
                                        type="text"
                                        placeholder="Last Name"
                                        onBlur={(e) => handleFieldUpdate("lastName", e.target.value)}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex gap-20 p-10">
                            {/* Email - Display Only */}
                            <div className="pl-10 pb-5 pr-10">
                                <p className="ml-4 text-lg font-medium mb-1">Email</p>
                                <p>{userData.email}</p>
                            </div>

                            {/* Telephone */}
                            <div className="pl-10 pb-5 pr-10">
                                <p className="ml-4 text-lg font-medium mb-1">Telephone</p>
                                {userData.telephone ? (
                                    <p>{userData.telephone}</p>
                                ) : (
                                    <Input
                                        type="tel"
                                        placeholder="+1 (123) 456-7890"
                                        onBlur={(e) => handleFieldUpdate("telephone", e.target.value)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Description */}
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
                        <div className="mt-8 ml-20">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Log Out
                        </button>
                    </div>
                    </div>
                </section>
            ) : (
                <p className="ml-20 text-lg">Please log in to access your profile details.</p>
            )}
        </div>
    );
};

export default ProfileComponent;
