"use client";
import React, { useEffect, useState } from 'react';
import ProfileComponent from './ProfileComponent';
import { getLoggedInUser, getUserInfo } from '@/lib/actions/user.actions';
import BusinessProfileComponent from './BusinessProfileComponent';
import Link from 'next/link';

const ProfilePage = () => {
    const [isBusiness, setIsBusiness] = useState<Boolean | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getLoggedInUser();
                setLoggedInUser(user);

                if (user) {
                    const userInfo = await getUserInfo({ userId: user.$id });
                    setIsBusiness(userInfo.business === true);
                }
            } catch (err) {
                setError("An error occurred while loading user information.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className="text-5xl font-bold mt-12 mb-12 ml-20">
                {loggedInUser ? (
                    "Profile"
                ) : (
                    <Link href="/sign-in" className="text-blue-500 hover:underline">
                        Please Log In Here
                    </Link>
                )}
            </h1>
            {loggedInUser && (
                isBusiness ? <BusinessProfileComponent /> : <ProfileComponent />
            )}
        </div>
    );
};

export default ProfilePage;
