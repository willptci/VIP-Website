"use client";

import { useEffect, useState } from "react";
import { fetchTopReviews } from "@/lib/actions/business.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";
import { FaStar } from "react-icons/fa";

interface TopReviewsCarouselProps {
  businessId: string;
}

const TopReviewsCarousel: React.FC<TopReviewsCarouselProps> = ({ businessId }) => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const reviewsData = await fetchTopReviews(businessId);
      setReviews(reviewsData);
    };

    loadReviews();
  }, [businessId]);

  if (reviews.length === 0) return <p></p>;

  return (
    <Carousel className="w-full max-w-lg mx-auto mt-6">
      <CarouselContent>
        {reviews.map((review, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="rounded-lg text-center">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{review.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg italic">{review.review}</p>
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {[1, 2, 3, 4, 5].map((value) => (
                        <FaStar
                            key={value}
                            className={`text-2xl ${value <= review.rating ? "text-yellow-500" : "text-gray-300"}`}
                        />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">By {review.authorName || "Anonymous"}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default TopReviewsCarousel;
