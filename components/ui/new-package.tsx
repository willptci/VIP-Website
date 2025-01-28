import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { packageFormSchema } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { NewPackageProps, Package } from '@/types';
import { addPackageToFirestore } from '@/lib/actions/business.actions';

const NewPackage: React.FC<NewPackageProps>  = ({ setNewPackage, addPackage }) => {
  const [status, setStatus] = useState(true);
  const [createPackageError, setCreatePackageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = packageFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        capacity: "",
        amount: "",
    },
  })

  // const onSubmit = async (data: z.infer<typeof formSchema>) => {
  //   setIsSubmitting(true);
  //   try {
  //     const packageData = {
  //       ...data,
  //       status,
  //     };

  //     console.log("Package Data to Submit:", packageData);

  //     const newPackage = await addPackageToFirestore(packageData);
  //     addPackage(newPackage);

  //     alert("Package successfully added!");

  //     setNewPackage(false);
  //   } catch (error: any) {
  //     setCreatePackageError(error.message || "An error occurred");
  //     console.error("Failed to create business:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const packageData: Package = {
        ...data,
        id: crypto.randomUUID(),
        status,
        createdAt: new Date().toISOString(),
      };
  
      console.log("Package Data to Submit:", packageData);
  
      await addPackageToFirestore(packageData);
      addPackage(packageData);
      alert("Package successfully added!");
      setNewPackage(false);
    } catch (error: any) {
      setCreatePackageError(error.message || "An error occurred");
      console.error("Failed to create business:", error);
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="rounded-xl border p-5 shadow mt-10">
        <h1 className="header-2 mb-5">New Package</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
            <div className="pl-4 pr-4 pb-5">
              <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Package</FormLabel>
                          <FormControl>
                              <Input placeholder="Package Title" {...field} className="max-w-sm"/>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
            </div>

            <div className="pl-4 pr-4 pb-5">
              <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Max Capacity</FormLabel>
                          <FormControl>
                              <Input placeholder="Max Number of Guests Allowed" {...field} className="max-w-sm"/>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
            </div>

            <div className="pl-4 pr-4 pb-5">
              <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                              <Input placeholder="Cost of Package" {...field} className="max-w-sm"/>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
            </div>
            <div className="flex items-center rounded-md border p-4 ml-4 mr-4">
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
            <div className="flex justify-center pt-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</Button>
              <p className="text-red-600">{createPackageError}</p>
            </div>
          </form>
      </Form>
    </div>
  )
}

export default NewPackage