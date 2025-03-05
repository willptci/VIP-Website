"use client";

import { useEffect, useState } from "react";
import { fetchUserPastTrips, submitReview } from "@/lib/actions/user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { Button } from "./button";
import { useForm } from "react-hook-form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { FaStar } from "react-icons/fa";

const PrevTripsList = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const tripsData = await fetchUserPastTrips();
        setTrips(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const onSubmit = async (data: any) => {
    if (!selectedTrip) return;

    console.log("submitting")

    const reviewData = {
      businessId: selectedTrip.businessId,
      rating,
      title: data.title,
      review: data.review,
    };

    try {
      await submitReview(reviewData);
      console.log("Review submitted:", reviewData);
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    reset();
    setSelectedTrip(null);
    setRating(0);
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  if (loading) return <p>Loading past trips...</p>;
  if (trips.length === 0) return <p>No past trips found.</p>;

  return (
    <div className="space-y-4 w-4/5">
      {trips.map((trip, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{trip.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {new Date(trip.date).toLocaleDateString()} at {trip.time}</p>
            <p>Guests: {trip.guests.adults} Adults, {trip.guests.children} Children, {trip.guests.infants} Infants</p>
            <p>Business: {trip.businessName}</p>
            <p className="font-bold">Total: ${trip.totalPrice.toFixed(2)}</p>
            <div className="flex justify-end w-full mt-4">
            <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" onClick={() => setSelectedTrip(trip)} className="">
                Leave a Review
              </Button>
            </AlertDialogTrigger>
            {selectedTrip?.businessId === trip.businessId && (
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave a Review for {selectedTrip.businessName}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Share your experience for this trip.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center gap-2 mb-4 ml-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <FaStar
                        key={value}
                        className={`cursor-pointer text-2xl ${value <= rating ? "text-yellow-500" : "text-gray-300"}`}
                        onClick={() => handleStarClick(value)}
                      />
                    ))}
                  </div>
                  <Input
                    placeholder="Review title"
                    {...register("title", { required: true })}
                    className="mb-2"
                  />
                  <Textarea
                    placeholder="Write your review..."
                    {...register("review", { required: true })}
                    className="mb-2"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedTrip(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit">Submit Review</AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            )}
          </AlertDialog>
          </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PrevTripsList;