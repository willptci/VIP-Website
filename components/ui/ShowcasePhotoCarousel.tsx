import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface PhotoCarouselProps {
  photos: string[];
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
    // Don't render the carousel at all if there are no images
    if (!photos || photos.length === 0) return null;

    return (
        <div className="w-[300px] h-[300px]">
            <Carousel>
            <CarouselContent>
                {photos.map((photo, index) => (
                <CarouselItem
                    key={index}
                >
                    <Card className="w-[300px] h-[300px]">
                    <CardContent className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <Image
                            src={photos[index]}
                            alt={`Photo ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </CardContent>
                    </Card>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            </Carousel>
        </div>
    );
}