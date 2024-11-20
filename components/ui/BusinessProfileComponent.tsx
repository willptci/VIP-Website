"use client";
import React, { useEffect, useState } from "react";
import {
    generateImageUrl,
  getLoggedInUser,
  getUserBusiness,
  logout,
  updateBusiness,
  uploadImageToAppwrite,
} from "@/lib/actions/user.actions";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BusinessCreationForm from "./BusinessCreationForm";

    const BusinessProfileComponent = () => {
    const [businessData, setBusinessData] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadedImages, setUploadedImages] = useState<(string | null)[]>([null, null, null]); // Store image URLs
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null); // To track which image is being uploaded

    const uploadBusinessImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
      
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to upload image");
        }
      
        const data = await response.json();
        return data.fileId;
      };

    useEffect(() => {
        const fetchBusinessData = async () => {
        try {
            const business = await getUserBusiness(); // Fetch business data using the function
            if (business?.images && business?.images.length > 0) {
                setUploadedImages(business.images); // Set existing images in state
            } else {
                setUploadedImages([null, null, null]);
            }
            setBusinessData(business);
        } catch (error) {
            console.error("Error fetching business data:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchBusinessData();
    }, []);

    const handleImageUpload = async (file: File, index: number) => {
        setUploadingIndex(index);
      
        try {
          const fileId = await uploadBusinessImage(file);
          console.log("Uploaded File ID:", fileId);
      
          const imageUrl = await generateImageUrl(fileId); // Generate the public URL

          //const imageUrl = `${ENDPOINT}/storage/buckets/${BUSINESS_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${PROJECT}&project=${PROJECT}&mode=admin`;
          console.log("Generated Image URL:", imageUrl);
      
          // Update the `uploadedImages` state
          setUploadedImages((prev) => {
            const newImages = [...prev];
            newImages[index] = imageUrl;
            return newImages;
          });
      
          // Optionally update the backend with the new images
          if (businessData) {
            const updatedBusiness = await updateBusiness(businessData.businessId!, {
              images: uploadedImages.filter((img): img is string => img !== null),
            });
            setBusinessData(updatedBusiness);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
        } finally {
          setUploadingIndex(null);
        }
      };
      

    const handleLogout = async () => {
        try {
            await logout(); // Clear session or tokens
            setBusinessData(null); // Clear business data state
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    if (loading) {
        return (
        <div className="flex justify-center items-center h-full">
            <p className="text-xl font-semibold text-gray-500">Loading...</p>
        </div>
        );
    }

    return (
        <div className="mt-20 h-full flex flex-col items-center justify-center">
        <div className="flex items-center mb-10">
            {/* Carousel Section */}
            <div className="flex flex-col items-center mr-40 mb-10 mt-8">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                Choose Your Profile Images
            </h1>

            <Carousel className="w-full max-w-[30rem]">
                <CarouselContent>
                {uploadedImages.map((image, index) => (
                    <CarouselItem key={index}>
                    <div className="p-1">
                        <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                            {image ? (
                            <img
                                src={image}
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <span className="text-gray-500 text-lg">
                                No Image Uploaded
                            </span>
                            )}
                        </CardContent>
                        </Card>
                        <div className="mt-2 flex justify-center">
                        <label
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                            {uploadingIndex === index ? "Uploading..." : "Upload Image"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleImageUpload(e.target.files[0], index);
                                    }
                                }}
                            />
                        </label>
                        </div>
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            </div>

            {/* Business Creation Form */}
            <div>
            <BusinessCreationForm />
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
