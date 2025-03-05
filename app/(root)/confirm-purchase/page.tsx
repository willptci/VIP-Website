"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { saveBooking } from "@/lib/actions/business.actions";

const ConfirmPurchase = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const title = searchParams.get("title") || "";
    const date = searchParams.get("date") || "";
    const time = searchParams.get("time") || "";
    const adults = Number(searchParams.get("adults") || "0");
    const children = Number(searchParams.get("children") || "0");
    const infants = Number(searchParams.get("infants") || "0");
    const price = Number(searchParams.get("price") || "0");
    const businessId = searchParams.get("businessId") || "";
    const businessName = searchParams.get("businessName") || "";
    const totalDuration = Number(searchParams.get("totalDuration") || "0");

    useEffect(() => {
        console.log("Title:", title);
        console.log("Date:", date);
        console.log("Time:", time);
        console.log("Adults:", adults);
        console.log("Children:", children);
        console.log("Infants:", infants);
        console.log("Price:", price);
        console.log("Business ID:", businessId);
        console.log("Business Name:", businessName);
        console.log("Duration:", totalDuration)
    }, [title, date, time, adults, children, infants, price, businessId, businessName, totalDuration]);    

    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = Number(price) * (Number(adults) + Number(children));

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);

    try {
      await saveBooking(title, date, time, adults, children, infants, totalPrice, businessId, businessName, totalDuration);

      router.push("/upcomingTrips");
    } catch (error) {
      console.log(error)
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Confirm Your Purchase</CardTitle>
          <p className="text-lg text-gray-600">with {businessName}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <p>{title}</p>
            <p>{new Date(date || "").toLocaleDateString()} at {time}</p>
            <p>Guests: {adults} Adults, {children} Children, {infants} Infants</p>
            <p>Duration: {totalDuration} hours</p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-medium">Total Price</h2>
            <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button disabled={isProcessing} onClick={handleConfirmPurchase} className="bg-green-500 text-white">
                {isProcessing ? "Processing..." : "Confirm & Pay"}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmPurchase;