"use client"
import { BusinessCalendar } from '@/components/ui/BusinessCalendar';
import DaySchedule from '@/components/ui/DaySchedule';
import EditHours from '@/components/ui/EditHours';
import NewBookingsCollapsible from '@/components/ui/NewBookingsCollapsible';
import { fetchBusinessSchedule, fetchBusinessUpcomingBookings } from '@/lib/actions/business.actions';
import React, { useEffect, useState } from 'react';

type Booking = {
  businessId: string;
  date: string;
  guests: { infants: number; adults: number; children: number };
  time: string;
  title: string;
  totalPrice: number;
  userId: string;
  totalDuration: number;
};

type OpenHours = {
  selectedDays: string[];
  start: string;
  end: string;
  unavailableTimes: { start: string; end: string }[];
};

type FixedSlot = {
  start: string;
  end: string;
  allowedPackages: string[];
};

type FixedSlots = {
  selectedDays: string[];
  blockedSlots: FixedSlot[];
};

// type Schedule = {
//   openHours: OpenHours | null;
//   fixedSlots: FixedSlots | null;
// };

type BookingsByDate = Record<string, Booking[]>;

const SchedulePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState<{ openHours: OpenHours[]; fixedSlots: FixedSlots[] }>({
    openHours: [],
    fixedSlots: [],
  });
  const [bookings, setBookings] = useState<BookingsByDate>({});
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadScheduleAndBookings = async () => {
  //     try {
  //       const [scheduleData, bookingsData] = await Promise.all([
  //         fetchBusinessSchedule(),
  //         fetchBusinessUpcomingBookings(),
  //       ]);

  //       setSchedule(scheduleData);
        
  //       const formattedBookings: Record<string, Booking[]> = bookingsData.reduce(
  //         (acc: Record<string, Booking[]>, booking: Booking) => {
  //           const bookingDateKey = new Date(booking.date).toISOString().split("T")[0]; // Extract YYYY-MM-DD
  //           if (!acc[bookingDateKey]) acc[bookingDateKey] = [];
  //           acc[bookingDateKey].push(booking);
  //           return acc;
  //         },
  //         {} as Record<string, Booking[]>
  //       );
    
  //       setBookings(formattedBookings);
  //       console.log("Formatted Bookings:", formattedBookings);
  //     } catch (error) {
  //       console.error("Error loading schedule or bookings:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadScheduleAndBookings();
  // }, []);

  useEffect(() => {
    const loadScheduleAndBookings = async () => {
      try {
        const scheduleData = await fetchBusinessSchedule();
  
        const bookingsData = await fetchBusinessUpcomingBookings()
          .then((data) => data)
          .catch((error) => {
            console.warn("Error fetching bookings:", error);
            return [];
          });
  
        setSchedule(scheduleData);
  
        const formattedBookings: Record<string, Booking[]> = bookingsData.reduce(
          (acc: Record<string, Booking[]>, booking: Booking) => {
            const bookingDateKey = new Date(booking.date).toISOString().split("T")[0]; // Extract YYYY-MM-DD
            if (!acc[bookingDateKey]) acc[bookingDateKey] = [];
            acc[bookingDateKey].push(booking);
            return acc;
          },
          {} as Record<string, Booking[]>
        );
  
        setBookings(formattedBookings);
        console.log("Formatted Bookings:", formattedBookings);
      } catch (error) {
        console.error("Error loading schedule or bookings:", error);
      } finally {
        // setLoading(false);
      }
    };
  
    loadScheduleAndBookings();
  }, []);

  const handleScheduleUpdate = async () => {
    try {
      const updatedSchedule = await fetchBusinessSchedule();
      setSchedule(updatedSchedule);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  // const loadSchedule = async () => {
  //   try {
  //     // const data = await fetchBusinessSchedule();
  //     setSchedule(data);
  //   } catch (error) {
  //     console.error("Error loading schedule:", error);
  //     setSchedule({ openHours: [], fixedSlots: [] });
  //   }
  // };

  // useEffect(() => {
  //   loadSchedule();
  // }, []);

  // const handleScheduleUpdate = async () => {
  //   await loadSchedule();
  // };

  // const bookingsPerDay = {
  //   '2025-02-12': 3,
  //   '2025-02-13': 1,
  //   '2025-02-15': 7,
  // };

  // const detailedBookings: BookingsByDate = {
  //   '2025-02-12': [
  //     { id: '1', startTime: '10:00 AM', endTime: '12:00 PM', name: 'John Doe' },
  //     { id: '2', startTime: '2:00 PM', endTime: '3:30 PM', name: 'Jane Smith' },
  //   ],
  //   '2025-02-13': [{ id: '3', startTime: '9:30 AM', endTime: '11:00 AM', name: 'Alice Johnson' }],
  // };  

  const selectedDateKey = date ? date.toISOString().split('T')[0] : null;
  const dayName = date
    ? date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    : null;

  const openHoursForDay = Array.isArray(schedule.openHours)
  ? schedule.openHours.find((oh) => oh.selectedDays.includes(dayName ?? ""))
  : null;

  const fixedSlotsForDay = Array.isArray(schedule.fixedSlots)
    ? schedule.fixedSlots.find((fs) => fs.selectedDays.includes(dayName ?? ""))
    : null;

  // const unavailableTimes = openHoursForDay ? openHoursForDay.unavailableTimes : [];

  const unavailableTimes = openHoursForDay?.unavailableTimes ?? [];

  const timeSlots = openHoursForDay
    ? [{ start: openHoursForDay.start, end: openHoursForDay.end }]
    : [];

  const fixedSlotBlocks = fixedSlotsForDay ? fixedSlotsForDay.blockedSlots : [];

  return (
    <section className="h-screen w-full p-10 flex flex-col">
      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-4 self-start">
          <BusinessCalendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full h-full pb-5"
            bookingsPerDay={Object.fromEntries(Object.entries(bookings).map(([date, list]) => [date, list.length]))}
          />
          <div className="pl-8 flex gap-10">
            {/* <NewBookingsCollapsible /> */}
            <EditHours onScheduleUpdate={handleScheduleUpdate}/>
          </div>
        </div>
        <div className="w-full p-3">
        <DaySchedule
          date={date}
          bookings={selectedDateKey ? bookings[selectedDateKey] || [] : []}
          timeSlots={timeSlots}
          unavailableTimes={unavailableTimes}
          fixedSlots={fixedSlotBlocks}
        />
        </div>
      </div>
    </section>
  )
}

export default SchedulePage;