"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Minus, Plus } from "lucide-react";
import { Package } from "@/types";

export function BookNowCard({
    selectedPackage,
    businessName,
  }: {
    selectedPackage: Package | null;
    businessName: string;
  }) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    const handleBooking = () => {
        if (!selectedDate) {
        alert("Please select a date.");
        return;
        }
        alert(`Booking confirmed for ${name} on ${selectedDate.toLocaleDateString()}.`);
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setPopoverOpen(false); // Close the popover when a date is selected
    };

    const increment = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        setter((prev) => prev + 1);
    
    const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        setter((prev) => (prev > 0 ? prev - 1 : 0));

    const totalPrice =
        selectedPackage?.amount && (adults + children)
        ? parseFloat(selectedPackage.amount) * (adults + children)
        : 0;

    return (
        <Card className="w-[350px]">
        <CardHeader>
            <CardTitle className="text-4xl font-semibold">Book Now</CardTitle>
            <CardDescription className="text-lg">
                {selectedPackage
                    ? `${selectedPackage.title} with ${businessName}`
                    : "Select a Package"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center items-center pb-10">
                <p className="text-4xl font-semibold">
                    {selectedPackage
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(totalPrice) // Convert to number and handle invalid cases
                        : "--"}
                </p>
            </div>

            <form>
            <div className="grid w-full items-center gap-10">
                {/* Date Picker */}
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                    {selectedDate
                        ? `Date: ${selectedDate.toLocaleDateString()}`
                        : "Pick Date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 shadow-lg rounded-md">
                    <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="bg-white"
                    />
                </PopoverContent>
                </Popover>

                <div className="flex flex-col space-y-1.5">
                <Label htmlFor="availableTimes" className="text-md">Available Times</Label>
                <Select>
                    <SelectTrigger id="availableTimes">
                    <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                    <SelectItem value="next">9:00am</SelectItem>
                    <SelectItem value="sveltekit">10:00am</SelectItem>
                    <SelectItem value="astro">11:00am</SelectItem>
                    <SelectItem value="nuxt">12:00pm</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-6">
                    <div>
                        <Label htmlFor="availableTimes" className="text-md">
                        Number of Guests
                        </Label>
                    </div>
                    <div className="space-y-4">
                        {/* Adults */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="text-sm font-medium">Adults</p>
                                <p className="text-xs text-muted-foreground">Age 13+</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    type="button"
                                    onClick={() => decrement(setAdults)}
                                >
                                    <Minus />
                                </Button>
                                <p className="text-sm font-medium">{adults}</p>
                                <Button
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    type="button"
                                    onClick={() => increment(setAdults)}
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="text-sm font-medium">Children</p>
                                <p className="text-xs text-muted-foreground">Age 2-12</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    type="button"
                                    onClick={() => decrement(setChildren)}
                                >
                                    <Minus />
                                </Button>
                                <p className="text-sm font-medium">{children}</p>
                                <Button
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    type="button"
                                    onClick={() => increment(setChildren)}
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>

                        {/* Infants */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Infants</p>
                                <p className="text-xs text-muted-foreground">Age 0-2</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    type="button"
                                    onClick={() => decrement(setInfants)}
                                >
                                    <Minus />
                                </Button>
                                <p className="text-sm font-medium">{infants}</p>
                                <Button
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    type="button"
                                    onClick={() => increment(setInfants)}
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button onClick={handleBooking}>Book Now</Button>
        </CardFooter>
        </Card>
    );
}