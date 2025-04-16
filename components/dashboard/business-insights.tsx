"use client";

import { useEffect, useState } from "react";
import { fetchBusinessInsights } from "@/lib/actions/business.actions";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function BusinessInsights() {
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await fetchBusinessInsights();
        setInsights(data);
      } catch (error) {
        console.error("Failed to load business insights:", error);
      }
    };

    loadInsights();
  }, []);

  if (!insights) return <div className="p-6">Loading dashboard...</div>;

  const revenueData = insights.bookings.map((b: any) => ({
    name: new Date(b.date).toLocaleDateString(),
    revenue: b.totalPrice,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-semibold">${insights.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-semibold">{insights.totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
            <p className="text-2xl font-semibold">{insights.averageRating?.toFixed(1) ?? "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
