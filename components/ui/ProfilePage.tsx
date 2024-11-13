"use client";
import React, { useEffect, useState } from 'react'
import ProfileComponent from './ProfileComponent'
import { getLoggedInUser, getUserInfo } from '@/lib/actions/user.actions';
import BusinessProfileComponent from './BusinessProfileComponent';

const ProfilePage = () => {
    const [isBusiness, setIsBusiness] = useState<Boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = await getLoggedInUser();
                const userInfo = await getUserInfo({ userId: loggedInUser.$id });

                setIsBusiness(userInfo.business === true);
            } catch (err) {
                setError("An error occurred while loading user information.");
            }
        };
        fetchData();
    }, []);

    if (error) return <div>{error}</div>;

    return (
        <div>
            {isBusiness ? <BusinessProfileComponent /> : <ProfileComponent />}
        </div>
    )
}

export default ProfilePage;