"use client";
import BookingsList from '@/components/ui/BookingsList';
import { Button } from '@/components/ui/button';
import TripsList from '@/components/ui/TripsList';
import { useAuthStore } from '@/state/authState';
import React, { useState } from 'react'

const UpcomingTrips = () => {
  const role = useAuthStore((state) => state.role);
  const [view, setView] = useState<"trips" | "bookings">("trips");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Upcoming {view === "trips" ? "Trips" : "Bookings"}
      </h1>

      {role === "business" ? (
        <div className="flex gap-4 mb-4">
          <Button
            onClick={() => setView("trips")}
            variant={view === "trips" ? "default" : "outline"}
          >
            View Trips
          </Button>
          <Button
            onClick={() => setView("bookings")}
            variant={view === "bookings" ? "default" : "outline"}
          >
            View Bookings
          </Button>
        </div>
      ) : null}

      {view === "trips" || role === "user" ? <TripsList /> : <BookingsList />}
    </div>
  );
};

export default UpcomingTrips;