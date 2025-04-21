"use client";

import { useEffect, useState } from "react";
import { fetchUserUpcomingTrips } from "@/lib/actions/user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TripsList = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const tripsData = await fetchUserUpcomingTrips();

        const now = new Date();

        const upcoming = tripsData.filter((trip: any) => {
          const tripDateTime = new Date(`${trip.date}T${trip.time}`);
          return tripDateTime > now;
        });

        setTrips(upcoming);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (trips.length === 0) return <p>No upcoming trips found.</p>;

  return (
    <div className="space-y-4">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TripsList;