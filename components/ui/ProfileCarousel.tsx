import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ProfileCarouselProps {
  photos: string[];
  numberOfImages: number;
  setNumberOfImages: (value: number) => void; // Callback to update the count
  handleImageUpload: (index: number) => void; // Function to handle image upload
}

export function ProfileCarousel({
  photos,
  numberOfImages,
  setNumberOfImages,
  handleImageUpload,
}: ProfileCarouselProps) {

  const handleAddImageSlot = () => {
    if (numberOfImages < 7) setNumberOfImages(numberOfImages + 1);
  };

  const handleRemoveImageSlot = () => {
    if (numberOfImages > photos.length) {
      setNumberOfImages(numberOfImages - 1);
    }
  };

  return (
    <div className="w-full">
      {/* <div className="flex justify-between mb-4">
        <Button variant="secondary" onClick={handleRemoveImageSlot} disabled={numberOfImages <= 1}>
          <Minus /> Remove Slot
        </Button>
        <Button variant="secondary" onClick={handleAddImageSlot} disabled={numberOfImages >= 7}>
          <Plus /> Add Slot
        </Button>
      </div> */}
      <Carousel>
        <CarouselContent>
          {Array.from({ length: numberOfImages }).map((_, index) => (
            <CarouselItem key={index} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
                <Card className="w-full h-full overflow-hidden">
                  <CardContent className="relative w-full h-full p-0">
                    {photos[index + 2] ? (
                      <img
                        src={photos[index + 2]}
                        alt={`Carousel item ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      // If no photo, display the index
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      className="flex-shrink-0 absolute top-4 right-4"
                      onClick={() => handleImageUpload(index + 2)}
                    >
                      <Plus /> Add Image
                    </Button>
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
