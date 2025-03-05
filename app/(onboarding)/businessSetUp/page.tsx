"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
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
import { businessFormSchema } from '@/lib/utils';
import { addBusinessToFirestore } from '@/lib/actions/business.actions';

const BusinessSetUp = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createBusinessError, setCreateBusinessError] = useState<string | null>(null);
    const router = useRouter();
    
    const formSchema = businessFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            companyName: "",
            phoneNumber: "",
            businessEmail: "",
            ownerDescription: "",
            companyDescription: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form submitted with data:", data);
        //setIsLoading(true);
        setCreateBusinessError(null);
        setIsSubmitting(true);
        try {
            const businessData = {
                ...data,
                createdAt: new Date().toISOString(),
            };
        
            const docId = await addBusinessToFirestore(businessData);
            console.log("Business created with ID:", docId);
        
            alert("Business successfully created!");

            router.push("/businessCustomize");

            setIsSubmitting(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setCreateBusinessError(error.message);
                console.error("Failed to create business:", error.message);
            } else {
                setCreateBusinessError("An unknown error occurred");
                console.error("Failed to create business:", error);
            }
            setIsSubmitting(false);
        }
    };

  return (
    <section className="p-6 pl-10 w-full h-screen flex flex-col justify-center font-syne text-custom-8 bg-custom-9 overflow-hidden">
        <div className="mb-5">
          <h1 className="text-5xl font-bold">Set Up Your Business</h1>
        </div>
        <div className="flex">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <p className="header-2 mt-8">Owner</p>
                    <div className="flex gap-20 p-4 w-full">
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First</FormLabel>
                                        <FormControl>
                                            <Input placeholder="first" {...field} className="max-w-sm bg-white"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last</FormLabel>
                                        <FormControl>
                                            <Input placeholder="last" {...field} className="max-w-sm bg-white"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="company" {...field} className="min-w-52 bg-white"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1-242-***-****" {...field} className="max-w-52 bg-white"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="businessEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="business@gmail.com" {...field} className="max-w-52 bg-white"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <p className="header-2 mt-5">How to advertise yourself on your page</p>
                    </div>
                    <div className="p-4">
                        <FormField
                            control={form.control}
                            name="ownerDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner Description</FormLabel>
                                    <FormControl>
                                        {/* <Input placeholder="What would you like user's to know about yourself?" {...field} className="h-14"/> */}
                                        <textarea
                                            placeholder="What would you like users to know about yourself?"
                                            {...field}
                                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring bg-white"
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You can always edit this later.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="p-4">
                        <FormField
                            control={form.control}
                            name="companyDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Description</FormLabel>
                                    <FormControl>
                                        {/* <Input placeholder="How would you describe your company to attract users?" {...field} className="h-14"/> */}
                                        <textarea
                                            placeholder="What would you like users to know about yourself?"
                                            {...field}
                                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring bg-white"
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You can always edit this later.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className='bg-white'>{isSubmitting ? "Submitting..." : "Submit"}</Button>
                    <p className="text-red-600">{createBusinessError}</p>
                </form>
            </Form>
        </div>
    </section>
  )
}

export default BusinessSetUp