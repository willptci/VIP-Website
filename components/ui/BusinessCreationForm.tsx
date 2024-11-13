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
import { businessFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import CustomBusinessInput from './CustomBusinessInput';
import { createBusiness } from '@/lib/actions/user.actions';

const BusinessCreationForm = () => {
    const [business, setBusiness] = useState<{ email?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const formSchema = businessFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })
 
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setSubmitError(null);

        try {
            const newBusiness = await createBusiness(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }

        if (isLoading) {
            return (
                <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                </>
            )
        }
    }

      return (
        <section className="auth-form">
            <header className='flex flex-col gap-5 md:gap-8 mb-6'>
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        Set up your Businesss Details
                    </h1>
                </div>
            </header>
                <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-10">
                        <div className="flex gap-5">
                            <div className="flex min-h-[60px]">
                                <CustomBusinessInput control={form.control} name='firstName' label="First" placeholder='Enter your first name' />
                            </div>
                            <div className="flex min-h-[60px]">
                                <CustomBusinessInput control={form.control} name='lastName' label="Last" placeholder='Enter your last name' />
                            </div>
                        </div>

                        <div className="flex flex-col min-h-[60px]">
                            <CustomBusinessInput control={form.control} name='companyName' label="Company" placeholder='Enter your Company Name' />
                        </div>

                        <div className="flex flex-col min-h-[60px]">
                            <CustomBusinessInput control={form.control} name='preferredContact' label="Contact" placeholder='Enter your company contact email or phone' />
                        </div>

                        <div className="flex flex-col min-h-[60px]">
                            <CustomBusinessInput control={form.control} name='description' label="Description" placeholder='Tell us a bit about yourself' />
                        </div>

                        <div className="flex flex-col min-h-[60px]">
                            <CustomBusinessInput control={form.control} name='offer' label="Product" placeholder='What are you offering guests?' />
                        </div>

                        <div className="flex flex-col min-h-[60px]">
                            <CustomBusinessInput control={form.control} name='charges' label="Prices" placeholder='What price packages do you offer?' />
                        </div>

                        {submitError && (
                        <div className="flex justify-center items-center">
                            <p className="text-red-600 text-[15px]">{submitError}</p>
                        </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex flex-col gap-4 ">
                            <Button type="submit" disabled={isLoading} className="form-btn">
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                                    </>
                                ) : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </Form>
                </>
        </section>
    )
}

export default BusinessCreationForm