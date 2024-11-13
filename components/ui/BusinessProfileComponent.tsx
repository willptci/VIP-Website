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
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import BusinessCreationForm from './BusinessCreationForm';
import { Calendar } from "@/components/ui/calendar"

const BusinessProfileComponent = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    useEffect(() => {
        const fetchData = async () => {
            const loggedInUser = await getLoggedInUser();
            const userInfo = await getUserInfo({ userId: loggedInUser.$id });
            setUserData(userInfo);
            setLoading(false);
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

    const handleLogout = async () => {
        await logout();
        setUserData(null);
    };

    const Loader = () => (
        <div className="flex justify-center items-center h-full">
            <p className="text-xl font-semibold text-gray-500">Loading...</p>
        </div>
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="mt-20 h-full flex flex-col items-center justify-center"> 
    <div className="flex items-center mb-10">
        <div className="flex flex-col items-center mr-40 mb-10 mt-8">
            <Carousel className="w-full max-w-[30rem]">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mt-8"
            />
        </div>
        
        {/* Business Creation Form */}
        <div>
            <BusinessCreationForm/>
        </div>
    </div>
    <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-10"
        >
        Log Out
    </button>
</div>

    );
};

export default BusinessProfileComponent;