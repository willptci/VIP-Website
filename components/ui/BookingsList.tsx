/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { fetchBusinessUpcomingBookings } from "@/lib/actions/business.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BookingsList = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookingsData = await fetchBusinessUpcomingBookings();
        
        const now = new Date();

        const upcoming = bookingsData.filter((booking: any) => {
          const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
          return bookingDateTime > now;
        });

        setBookings(upcoming);

      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (bookings.length === 0) return <p>No upcoming bookings found.</p>;

  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => (
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

export default BookingsList;