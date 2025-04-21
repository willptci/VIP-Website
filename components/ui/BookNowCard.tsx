"use client";
import * as React from "react";
import { useEffect, useState } from "react";
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
import { fetchBusinessSchedule } from "@/lib/actions/business.actions";
import { useRouter } from "next/navigation";

export function BookNowCard({
    selectedPackage,
    businessName,
    businessId,
  }: {
    selectedPackage: Package | null;
    businessName: string;
    businessId: string;
  }) {

    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [popoverOpen, setPopoverOpen] = useState(false);

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | undefined>();

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    const [validScheduleDates, setValidScheduleDates] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadSchedule = async () => {
          const schedule = await fetchBusinessSchedule();
      
          const validDays = new Set<string>();
      
          const allEntries = [...(schedule.openHours ?? []), ...(schedule.fixedSlots ?? [])];
          allEntries.forEach(entry => {
            entry.selectedDays.forEach((day: string) => validDays.add(day.toLowerCase()));
          });
      
          setValidScheduleDates(validDays);
        };
      
        loadSchedule();
      }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchScheduleForDay(selectedDate);
        }
    }, [selectedDate, selectedPackage]);

    const disableDays = (date: Date) => {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        return !validScheduleDates.has(dayName); // disable days not in schedule
    };

    const fetchScheduleForDay = async (date: Date) => {
        const schedule = await fetchBusinessSchedule();
        const dayKey = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

        const openHours = schedule.openHours.find((oh) => oh.selectedDays.includes(dayKey));
        const fixedSlots = schedule.fixedSlots.find((fs) => fs.selectedDays.includes(dayKey));

        if (openHours) {
            setAvailableTimes(generateAvailableSlots(openHours.start, openHours.end, openHours.unavailableTimes));
        } else if (fixedSlots) {
            setAvailableTimes(
            fixedSlots.blockedSlots.flatMap((slot) =>
                generateAvailableSlots(slot.start, slot.end, [])
            )
            );
        } else {
            setAvailableTimes([]);
        }
    };

    const generateAvailableSlots = (
        start: string,
        end: string,
        unavailableTimes: { start: string; end: string }[]
      ): string[] => {
        if (!selectedPackage) return [];
    
        const slots: string[] = [];
        const packageDuration = selectedPackage.total ?? 60;
        let currentTime = convertToMinutes(start);
        const endTime = convertToMinutes(end);
    
        while (currentTime + packageDuration <= endTime) {
          const timeStr = convertToTime(currentTime);
    
          if (
            !unavailableTimes.some(
              (unavailable) =>
                currentTime >= convertToMinutes(unavailable.start) &&
                currentTime < convertToMinutes(unavailable.end)
            )
          ) {
            slots.push(timeStr);
          }
    
          currentTime += 30;
        }
    
        return slots;
    };

    const convertToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };
    
    const convertToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? "PM" : "AM";
        return `${(hours % 12) || 12}:${mins.toString().padStart(2, "0")} ${period}`;
    };

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) {
          alert("Please select a date and time.");
          return;
        }

        console.log("PreBookingPage")
        console.log("Booking Details:");
        console.log("Title:", selectedPackage?.title || "");
        console.log("Date:", selectedDate.toISOString());
        console.log("Time:", selectedTime);
        console.log("Adults:", adults);
        console.log("Children:", children);
        console.log("Infants:", infants);
        console.log("Price:", selectedPackage?.amount);
        console.log("Business ID:", businessId || "");
        console.log("Business Name:", businessName || "");
        console.log("PreBookingPageEnd")
        console.log("Total Duration (minutes):", selectedPackage?.total || "Not Provided");
    
        router.push(
            `/confirm-purchase?title=${encodeURIComponent(selectedPackage?.title || "")}` +
            `&date=${selectedDate.toISOString()}` +
            `&time=${selectedTime}` +
            `&adults=${adults}` +
            `&children=${children}` +
            `&infants=${infants}` +
            `&price=${selectedPackage?.amount}` +
            `&businessId=${businessId || ""}` +
            `&businessName=${encodeURIComponent(businessName || "")}` +
            `&totalDuration=${selectedPackage?.total || 0}`
        );       
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setPopoverOpen(false);
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
        <Card className="w-[350px] font-syne text-custom-8">
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
                        }).format(totalPrice)
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
                <PopoverContent className="shadow-lg rounded-md bg-white">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={disableDays}
                        
                    />
                </PopoverContent>
                </Popover>

                <div className="flex flex-col space-y-1.5">
                <Label htmlFor="availableTimes" className="text-md">Available Times</Label>
                <Select onValueChange={(value) => setSelectedTime(value)}>
                    <SelectTrigger id="availableTimes">
                    <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                        {availableTimes.length > 0 ? (
                            availableTimes.map((time, index) => (
                            <SelectItem key={index} value={time}>
                                {time}
                            </SelectItem>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No times available</p>
                        )}
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