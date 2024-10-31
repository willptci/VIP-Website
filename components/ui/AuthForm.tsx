"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';

const AuthForm = ({ type } : { type : string}) => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

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

        try {
          // Sign up with Appwrite & create plaid token
          if(type === 'sign-up') {
            const userData = {
              email: data.email,
              password: data.password
            }
  
            const newUser = await signUp(userData);
  
            setUser(newUser);
          }
  
          if(type === 'sign-in') {
            const response = await signIn({
              email: data.email,
              password: data.password,
            })
  
            if(response) router.push('/')
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }

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
                            ? 'Link Account Payment'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                    </h1>
                    <p className="text-16 font-normal text-gray-600">
                        {user 
                            ? 'Link your account now or later'
                            : 'Please enter your details'
                        }
                    </p>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    {/* User-specific content */}
                </div>
            ) : (
                <>
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
    
                        {/* Submit Button */}
                        <div className="flex flex-col gap-4">
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