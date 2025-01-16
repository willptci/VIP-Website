import * as React from "react"
import { Plus } from "lucide-react"
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
  numberOfImages: number;
}

export function ProfileCarousel({ numberOfImages }: ProfileCarouselProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {Array.from({ length: numberOfImages }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="relative flex h-64 w-full items-center justify-center p-6">
                  <Button variant="secondary" className="flex-shrink-0 absolute top-4 right-4"><Plus/> add image</Button>
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
