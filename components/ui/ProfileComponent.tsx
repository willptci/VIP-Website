"use client";
import React, { useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getLoggedInUser } from '@/lib/actions/user.actions';
import Link from 'next/link';

const ProfileComponent = async () => {
    const [isLoading, setIsLoading] = useState(false);
    const loggedIn = await getLoggedInUser();
    return (
        <div className="ml-40 mt-16">
            
            <h1 className="text-5xl font-bold mb-12 ml-20">
                {loggedIn ? (
                    "Profile"
                ) : (
                <Link href="/sign-in" className="text-blue-500 hover:underline">
                    Please Log In Here
                </Link>
                )}
            </h1>
            
            {loggedIn ? (
                <section className="flex items-start gap-20">
                    <div>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>PROFILE</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="flex gap-20 pl-10 pb-5 pr-10">
                            <div>
                                <p className="ml-4 text-lg font-medium mb-1">First</p>
                                <Input type="text" placeholder="First Name" defaultValue={loggedIn.firstName} />
                            </div>
                            <div>
                                <p className="ml-4 text-lg font-medium mb-1">Last</p>
                                <Input type="text" placeholder="Last Name" defaultValue={loggedIn.lastName} />
                            </div>
                        </div>
                        <div className="flex gap-20 p-10">
                            <div>
                                <p className="ml-4 text-lg font-medium mb-1">Email</p>
                                <p>{loggedIn.email}</p>
                            </div>
                            <div>
                                <p className="ml-4 text-lg font-medium mb-1">Telephone</p>
                                <Input type="tel" placeholder="+1 (123) 456-7890" defaultValue={loggedIn.telephone} />
                            </div>
                        </div>
                        <div>
                            <p className="ml-4 text-lg font-medium mb-1">Description</p>
                            <Textarea placeholder="Describe what you're excited to do in Andros and what you're looking for in a trip!" defaultValue={loggedIn.description} />
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
