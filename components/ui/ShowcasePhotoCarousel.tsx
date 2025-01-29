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

  return (
    <div className="w-full">
      <Carousel>
        <CarouselContent>
          {photos?.length > 0 && (
            photos.map((photo, index) => (
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
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
