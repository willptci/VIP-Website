import React, { useState } from 'react'
import { NewPackageProps, Package } from '@/types';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';
import { Button } from './button';
import { Plus } from 'lucide-react';
import { packageFormSchema } from '@/lib/utils';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addPackageToFirestore, uploadPhotoForBusiness, uploadPhotoForPackage } from '@/lib/actions/business.actions';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from './input';
import { Switch } from './switch';
import {Textarea} from './textarea'
import { AddPackageCarousel } from './AddPackageCarousel';

const AddPackage: React.FC<NewPackageProps>  = ({ addPackage }) => {
    const [createPackageError, setCreatePackageError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(true);
    const [photos, setPhotos] = useState<string[]>([]);

    const formSchema = packageFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            title: "",
            capacity: "",
            amount: "",
            per: "",
            what: "",
            time: "",
            included: "",
            bring: "",
        },
    })

    const handleImageUpload = React.useCallback(async (file: File, index: number) => {
        try {

        console.log(`Uploading file at index ${index}...`);
        // Upload file to Firebase Storage
        const downloadURL = await uploadPhotoForPackage(file);

        console.log(`Uploaded image URL: ${downloadURL}`);
    
        setPhotos((prevPhotos) => {
            const updatedPhotos = [...prevPhotos];
            updatedPhotos[index] = downloadURL; 
            return updatedPhotos;
        });
        } catch (error) {
        console.error("Error uploading photo:", error);
        }
    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const packageData: Package = {
                ...data,
                id: crypto.randomUUID(),
                status,
                createdAt: new Date().toISOString(),
                photos: photos,
            };
    
        console.log("Package Data to Submit:", packageData);
    
            await addPackageToFirestore(packageData);
            addPackage(packageData);
            alert("Package successfully added!");
        } catch (error: any) {
            setCreatePackageError(error.message || "An error occurred");
            console.error("Failed to create business:", error);
        } finally {
            
        }
    };  

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" className="flex">
                    <Plus/>
                    Add Package
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-custom-9 font-syne text-custom-8 rounded-t-lg">
                <div className="mx-auto w-full pl-20 pr-20 justify-center items-center">
                <DrawerHeader>
                    <DrawerTitle className="font-semibold text-3xl">Create a Package</DrawerTitle>
                    <DrawerDescription>Fill all the neccessary fields for users to see.</DrawerDescription>
                </DrawerHeader>
                    <div className="p-4 pb-0">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
                                <div className="flex flex-wrap lg:flex-nowrap w-full">
                                    <div className="flex flex-col w-2/5 ">
                                        <div className="pb-5">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Package Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Title" {...field} className="max-w-sm bg-white"/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Short and Sweet.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="pb-5">
                                            <FormField
                                                control={form.control}
                                                name="capacity"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Max Capacity</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Max Number of Guests per Price" {...field} className="max-w-sm bg-white"/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            e.g. 5, 10, 20+, unlimited...
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="pb-5">
                                            <FormField
                                                control={form.control}
                                                name="amount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Cost of Package" {...field} className="max-w-sm bg-white"/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Input a number.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="pb-5">
                                            <FormField
                                                control={form.control}
                                                name="per"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Per</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Price per..." {...field} className="max-w-sm bg-white"/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            e.g. total, person, kayake, lesson...
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center rounded-md border p-3 w-60 bg-white">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium leading-none">
                                                Status
                                                </p>
                                            </div>
                                            <div className="flex gap-5">
                                                <p className={status === true ? "text-green-700" : "text-red-500"}> {status === true ? "available" : "unavailable"}</p>
                                                <Switch
                                                checked={status}
                                                onCheckedChange={(checked) => setStatus(checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full lg:w-3/4">
                                        <div className="pb-5">
                                            <FormField
                                                control={form.control}
                                                name="what"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>What you'll do</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="" {...field} className='bg-white'/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Describe the experience.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="pb-5 gap-4 flex">
                                            <FormField
                                                control={form.control}
                                                name="time"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>How long will it be</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="" {...field} className="w-full bg-white"/>
                                                        </FormControl>
                                                        <FormDescription>
                                                            e.g. 45 minutes for ..., and 1 hr for ...
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="total"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Total time</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0.5, 1, 2.5 hrs" {...field} className="w-36 bg-white"
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Must enter in hours
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="">
                                                <div className="pb-5">
                                                    <FormField
                                                        control={form.control}
                                                        name="included"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>What is included</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="" {...field} className='bg-white'/>
                                                                </FormControl>
                                                                <FormDescription>
                                                                    e.g. drinks, food, etc...
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="pb-5">
                                                    <FormField
                                                        control={form.control}
                                                        name="bring"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>What to bring</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="" {...field} className='bg-white'/>
                                                                </FormControl>
                                                                <FormDescription>
                                                                    e.g. sunscreen, driver's license, snacks, water
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="pl-24 pt-5">
                                                <AddPackageCarousel photos={photos} onPhotoUpload={handleImageUpload}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DrawerFooter className="w-1/2 mx-auto flex flex-col gap-2">
                                    <DrawerClose asChild>
                                        <Button type="submit" className='bg-white' disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</Button>
                                        {/* <Button variant="outline">Cancel</Button> */}
                                    </DrawerClose>
                                    <p className="text-red-600">{createPackageError}</p>
                                </DrawerFooter>
                            </form>
                        </Form>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default AddPackage