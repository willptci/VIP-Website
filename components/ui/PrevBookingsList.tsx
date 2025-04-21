"use client";

import { useEffect, useState } from "react";
import { fetchBusinessPastBookings } from "@/lib/actions/business.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrevBookingsList = () => {
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookingsData = await fetchBusinessPastBookings();
        
        const now = new Date();

        const pastOnly = bookingsData.filter((booking: any) => {
          const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
          return bookingDateTime < now;
        });

        setPastBookings(pastOnly);

      } catch (error) {
        console.error("Error fetching past bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) return <p>Loading past bookings...</p>;
  if (pastBookings.length === 0) return <p>No past bookings found.</p>;

  return (
    <div className="space-y-4">
      {pastBookings.map((booking, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{booking.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
            <p>Guests: {booking.guests.adults} Adults, {booking.guests.children} Children, {booking.guests.infants} Infants</p>
            <p>User: {booking.userId}</p>
            <p className="font-bold">Total: ${booking.totalPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PrevBookingsList;