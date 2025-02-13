import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "./input";
import Image from "next/image";

interface AddPackageCarouselProps {
    photos: string[]; // Stores Firebase URLs
    onPhotoUpload: (file: File, index: number) => void;
}

export function AddPackageCarousel({ photos, onPhotoUpload }: AddPackageCarouselProps) {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
        onPhotoUpload(file, index);
        }
    };

    return (
        <Carousel className="w-[300px] h-[300px]">
            <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index}>
                <Card className='bg-white'>
                    <CardContent className="relative w-[300px] h-[300px] flex items-center justify-center overflow-hidden">
                    {/* If photo exists, display it */}
                    {photos[index] ? (
                        <Image
                            src={photos[index]}
                            alt={`Photo ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    ) : (
                        // If no photo, display a placeholder with index
                        <div className="flex items-center justify-center object-cover w-full h-full">
                        <span className="text-4xl font-semibold text-gray-400">{index + 1}</span>
                        </div>
                    )}

                        <div className="absolute inset-0 top-0 flex p-4">
                            <Input
                                id={`picture-${index}`}
                                type="file"
                                accept="image/*"
                                className="p-2 border rounded-lg bg-white shadow-md"
                                onChange={(e) => handleFileChange(e, index)}
                            />
                        </div>
                    
                    </CardContent>
                </Card>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
        </Carousel>
    );
}
