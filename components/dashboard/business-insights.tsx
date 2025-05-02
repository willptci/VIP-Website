"use client";

import { useEffect, useState } from "react";
import { fetchBusinessInsights } from "@/lib/actions/business.actions";
import { Card, CardContent } from "@/components/ui/card";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"; // ✅ import your chart

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

  if (!insights) return <div className="p-6 text-custom-10">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1e293b] text-white shadow-chart rounded-xl">
          <CardContent className="p-4">
            <p className="text-sm text-custom-10">Total Revenue</p>
            <p className="text-2xl font-semibold">${insights.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1e293b] text-white shadow-chart rounded-xl">
          <CardContent className="p-4">
            <p className="text-sm text-custom-10">Total Bookings</p>
            <p className="text-2xl font-semibold">{insights.totalBookings}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1e293b] text-white shadow-chart rounded-xl">
          <CardContent className="p-4">
            <p className="text-sm text-custom-10">Avg. Rating</p>
            <p className="text-2xl font-semibold">
              {insights.averageRating?.toFixed(1) ?? "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-[#1e293b] rounded-2xl shadow-chart p-6">
        <h2 className="text-xl font-semibold mb-4 text-custom-10">Revenue Over Time</h2>
        <ChartAreaInteractive /> {/* ✅ embedded here */}
      </div>
    </div>
  );
}
