"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getLoggedInUser, getUserInfo, logout, updateUserProfile, uploadProfileImage } from "@/lib/actions/user.actions";
import { userFormSchema } from "@/lib/utils";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const formSchema = userFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: "",
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      description: "",
      profileImageUrl: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = await getLoggedInUser();
      if (loggedInUser) {
        const userData = await getUserInfo(loggedInUser.uid);
        setUser({ uid: loggedInUser.uid, ...userData });
        form.reset({ uid: loggedInUser.uid, ...userData });
      }
    };
    fetchUserData();
  }, [form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (user && user.uid) {
      await updateUserProfile(user.uid, data);
      router.refresh();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (user && user.uid) {
      const imageUrl = await uploadProfileImage(e.target.files[0], user.uid);
      form.setValue("profileImageUrl", imageUrl);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  return (
    <section className="p-6 w-full flex flex-col justify-center font-syne text-custom-8 bg-white">
      <Button onClick={handleLogout} className="absolute top-4 right-4">Sign Out</Button>
      <div className="mb-5">
        <h1 className="text-3xl font-bold">User Profile</h1>
      </div>
      <div className="flex gap-10">
        <Avatar>
          <AvatarImage src={form.watch("profileImageUrl")} alt="User Avatar" className="object-cover" />
          <AvatarFallback className="bg-custom-8 text-white">Profile</AvatarFallback>
        </Avatar>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea {...field} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type="file" onChange={handleFileChange} />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default UserProfile;