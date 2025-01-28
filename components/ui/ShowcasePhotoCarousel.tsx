import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PhotoCarouselProps {
  photos: string[];
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  // Filter photos from index 2 onwards
  const filteredPhotos = photos.slice(2);

  return (
    <div className="w-full">
      <Carousel>
        <CarouselContent>
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo, index) => (
              <CarouselItem
                key={index}
                className="w-full h-[400px] sm:h-[500px] md:h-[600px]"
              >
                <Card className="w-full h-full overflow-hidden">
                  <CardContent className="relative w-full h-full p-0">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[400px] sm:h-[500px] md:h-[600px]">
              <p className="text-lg font-semibold">No photos available</p>
            </div>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
