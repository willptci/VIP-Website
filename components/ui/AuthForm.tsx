"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox"
import { useAuthStore } from "@/state/authState";

const AuthForm = ({ type } : { type : string}) => {
    const router = useRouter();
    const [user, setUser] = useState<{ email?: string | null } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const setRole = useAuthStore((state) => state.setRole);
    const role = useAuthStore((state) => state.role)

  const handleCheckboxChange = (checked: CheckedState) => {
    setIsChecked(checked === true);
  };

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: ''
        },
    })
 
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setAuthError(null);
        const { email, password } = data;
    
        try {
          if (type === "sign-up") {
            const newUser = await signUp({ email, password });
            setUser({ email: newUser.email });
            if (isChecked) {
              setRole("business");
            } else {
              setRole("user");
            }
          }
    
          if (type === "sign-in") {
            const loggedInUser = await signIn({ email, password });
            setUser({ email: loggedInUser.email });
            router.push("/");
          }
        } catch (error: any) {
          setAuthError(error.message || "An error occurred");
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <section className="auth-form">
            <header className='flex flex-col gap-5 md:gap-8 mb-6'>
                <Link href="/" className="cursor-pointer flex items-center gap-1">
                    <Image 
                        src="/icons/bonefish.svg"
                        width={64}
                        height={64}
                        alt="Andros logo"
                    />
                    <h1 className="text-36 font-ibm-plex-serif font-bold text-black-1">Andros</h1>
                </Link>
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user 
                            ? 'Success!'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                    </h1>
                    <p className="text-16 font-normal text-gray-600">
                        {user 
                            ? <>Signed up with <strong>{user.email}</strong> !</>
                            : 'Please enter your details'
                        }
                    </p>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    <Button type="button" disabled={isLoading} className="to-home relative" onClick={() => !isLoading && (role === "business" ? router.push('/businessSetUp') : router.push('/userSetUp'))}>
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-center w-full">Set up my {role === "business" ? "business" : "profile"}</span>
                                        <Image src="/icons/arrow-right.svg" width={20} height={20} alt="arrow" className="absolute right-4 top-1/2 transform -translate-y-1/2"/>
                                    </>
                                )}
                    </Button>
                </div>
            ) : (
                <>
                {type === 'sign-up' && (
                <div className="flex items-center space-x-2 p-5">
                        <Checkbox id="terms" onCheckedChange={handleCheckboxChange}/>
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Sign up as a Business
                        </label>
                </div>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Email Input */}
                        <div className="flex flex-col gap-2 min-h-[80px]">
                            <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' />
                        </div>
                        
                        {/* Password Input */}
                        <div className="flex flex-col gap-2 min-h-[80px]">
                            <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' />
                        </div>
    
                        {/* Verify Password (Sign-Up Only) */}
                        {type === 'sign-up' && (
                            <div className="flex flex-col gap-2 min-h-[80px]">
                                <CustomInput control={form.control} name='verifiedPassword' label="Verify Password" placeholder='Enter your password' />
                            </div>
                        )}

                        {authError && (
                        <div className="flex justify-center items-center">
                            <p className="text-red-600 text-[15px]">{authError}</p>
                        </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex flex-col gap-4 ">
                            <Button type="submit" disabled={isLoading} className="form-btn">
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                                    </>
                                ) : type === 'sign-in' 
                                    ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                </Form>
                
                <footer className="flex justify-center gap-1 pt-2">
                  <p className="text-14 font-normal text-gray-600">
                    {type === 'sign-in'
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </p>
                  <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
                    {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                  </Link>
                </footer>
                </>
            )}
        </section>
    )    
}

export default AuthForm