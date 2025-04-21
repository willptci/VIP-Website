import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

interface DayScheduleProps {
  date: Date | undefined;
  bookings: Booking[];
  timeSlots: { start: string; end: string }[];
  unavailableTimes: { start: string; end: string }[];
  fixedSlots: { start: string; end: string; allowedPackages: string[] }[];
}

const DaySchedule = ({
  date,
  bookings,
  timeSlots,
  unavailableTimes,
  fixedSlots,
}: DayScheduleProps) => {
  const convert24HoursToMinutes = (time: string): number => {
    if (!time) return 0;
  
    const [hourPart, minutePart] = time.split(":");
    let hour = parseInt(hourPart, 10);
    const minute = parseInt(minutePart, 10) || 0;
  
    return hour * 60 + minute;
  };

  const convert12HoursToMinutes = (time: string): number => {
    if (!time) return 0;
    
    const [hourPart, minutePart] = time.split(/[: ]/);
    let hour = parseInt(hourPart, 10);
    const minute = parseInt(minutePart, 10) || 0;
    const isPM = time.includes("PM");
  
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
  
    return hour * 60 + minute;
  };

  const formatTime = (minutes: number) => {
    let hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
  
    if (hour >= 24) hour -= 24; 
    let formattedHour = hour % 12 || 12;
  
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const mergedFixedSlots: { start: string; end: string; allowedPackages: string[] }[] = [];
  fixedSlots.forEach(slot => {
    if (
      mergedFixedSlots.length > 0 &&
      mergedFixedSlots[mergedFixedSlots.length - 1].allowedPackages.join(",") ===
        slot.allowedPackages.join(",") &&
      convert24HoursToMinutes(mergedFixedSlots[mergedFixedSlots.length - 1].end) ===
        convert24HoursToMinutes(slot.start)
    ) {
      mergedFixedSlots[mergedFixedSlots.length - 1].end = slot.end;
    } else {
      mergedFixedSlots.push(slot);
    }
  });

  const mergedOpenHours: { start: string; end: string }[] = [];

  timeSlots.forEach(({ start, end }) => {
    let blocks = [{ start: convert24HoursToMinutes(start), end: convert24HoursToMinutes(end) }];

    unavailableTimes.forEach(({ start: uStart, end: uEnd }) => {
      let uStartMin = convert24HoursToMinutes(uStart);
      let uEndMin = convert24HoursToMinutes(uEnd);
      let newBlocks: { start: number; end: number }[] = [];

      blocks.forEach(({ start: blockStart, end: blockEnd }) => {
        if (uStartMin > blockStart && uEndMin < blockEnd) {
          // Split into two blocks if unavailable is in the middle
          newBlocks.push({ start: blockStart, end: uStartMin });
          newBlocks.push({ start: uEndMin, end: blockEnd });
        } else if (uStartMin <= blockStart && uEndMin < blockEnd) {
          // Unavailable trims the start
          newBlocks.push({ start: uEndMin, end: blockEnd });
        } else if (uStartMin > blockStart && uEndMin >= blockEnd) {
          // Unavailable trims the end
          newBlocks.push({ start: blockStart, end: uStartMin });
        } else if (uStartMin <= blockStart && uEndMin >= blockEnd) {
          // Fully unavailable, do nothing
        } else {
          newBlocks.push({ start: blockStart, end: blockEnd });
        }
      });

      blocks = newBlocks;
    });

    blocks.forEach(({ start, end }) => {
      if (start < end) {
        mergedOpenHours.push({ start: formatTime(start), end: formatTime(end) });
      }
    });
  });
  
  const openStartTimes = mergedOpenHours.map(({ start }) => convert12HoursToMinutes(start));
  const fixedStartTimes = mergedFixedSlots.map(({ start }) => convert24HoursToMinutes(start));
  const openEndTimes = mergedOpenHours.map(({ end }) => convert12HoursToMinutes(end));
  const fixedEndTimes = mergedFixedSlots.map(({ end }) => convert24HoursToMinutes(end));

  const hasTimeData = openStartTimes.length > 0 || fixedStartTimes.length > 0;

  const defaultStart = 8 * 60; // 8:00 AM
  const defaultEnd = 18 * 60; // 6:00 PM

  const earliestStart = hasTimeData
    ? Math.min(...openStartTimes, ...fixedStartTimes) - 60
    : defaultStart;

  const latestEnd = hasTimeData
    ? Math.max(...openEndTimes, ...fixedEndTimes) + 60
    : defaultEnd;

  // Make sure it's not negative
  const interval = 30;
  const blockCount = Math.max(0, Math.ceil((latestEnd - earliestStart) / interval));

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow text-custom-8">
      <h2 className="text-lg font-semibold mb-4">
        {date ? date.toDateString() : "Select a date"}
      </h2>

      <div className="flex flex-col relative">
        {[...Array(blockCount)].map((_, i) => {
          const minutes = earliestStart + i * interval;
          const formattedTime = formatTime(minutes);

          // const booking = bookings.find((b) => {
          //   const startTimeMinutes = convert12HoursToMinutes(b.time);
          //   const endTimeMinutes = startTimeMinutes + b.totalDuration * 60; // Convert hours to minutes
          
          //   return startTimeMinutes <= minutes && endTimeMinutes > minutes;
          // });

          const booking = bookings.find(
            (b) => convert12HoursToMinutes(b.time) === minutes
          );

          const fixedSlot = mergedFixedSlots.find(
            ({ start, end }) =>
              convert24HoursToMinutes(start) <= minutes &&
              convert24HoursToMinutes(end) > minutes
          );

          const openHour = mergedOpenHours.find(
            ({ start, end }) =>
              convert12HoursToMinutes(start) <= minutes &&
              convert12HoursToMinutes(end) > minutes
          );

          return (
            <div key={minutes} className="relative flex flex-col -mt-[1px]" style={{ height: "3.5rem" }}>
              {/* <div className="flex items-center">
                <span className={cn("text-sm w-20", minutes % 60 === 0 ? "text-gray-600" : "text-gray-400")}>
                  {formattedTime}
                </span>
                <Separator className="flex-1 bg-gray-300" />
              </div> */}

              <div className="flex items-center">
                <span className={cn("text-sm w-20", minutes % 60 === 0 ? "text-gray-600" : "text-gray-400")}>
                  {formattedTime}
                </span>
                {!bookings.some(
                  (b) =>
                    convert12HoursToMinutes(b.time) <= minutes &&
                    convert12HoursToMinutes(b.time) + b.totalDuration * 60 > minutes
                ) && <Separator className="flex-1 bg-gray-300" />}
              </div>

              {openHour && !fixedSlot && convert12HoursToMinutes(openHour.start) >= minutes && convert12HoursToMinutes(openHour.start) < minutes + interval && (
                <div
                  className="absolute left-[5rem] right-0 bg-green-200 opacity-40 p-3 text-sm text-black rounded-md"
                  style={{
                    height: `${(convert12HoursToMinutes(openHour.end) - convert12HoursToMinutes(openHour.start)) / interval * 3.55}rem`,
                  }}
                />
              )}

              {fixedSlot && convert24HoursToMinutes(fixedSlot.start) >= minutes && convert24HoursToMinutes(fixedSlot.start) < minutes + interval && (
                <div
                  className="absolute left-[5rem] right-0 bg-purple-200 opacity-40 p-3 text-sm text-black rounded-md"
                  style={{
                    height: `${(convert24HoursToMinutes(fixedSlot.end) - convert24HoursToMinutes(fixedSlot.start)) / interval * 3.55}rem`,
                  }}
                >
                  <div className="text-xs text-gray-700 font-semibold">{fixedSlot.allowedPackages.join(", ")}</div>
                </div>
              )}

              {/* {booking && (
                <div className="absolute left-[5rem] right-0 bg-blue-500 p-5 text-white text-xl rounded-md flex justify-between items-center shadow-md">
                  <span>{booking.name}</span>
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
              )} */}
              {/* {booking && (
                <div className="absolute left-[5rem] right-0 bg-blue-500 p-4 text-white text-sm rounded-md flex flex-col shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{booking.title}</span>
                    <span className="text-sm">
                      {booking.time} - {formatTime(convert12HoursToMinutes(booking.time) + booking.totalDuration * 60)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs">
                    <p>
                      Guests: 
                      <span className="ml-1">{booking.guests.adults} Adults,</span> 
                      <span className="ml-1">{booking.guests.children} Children,</span> 
                      <span className="ml-1">{booking.guests.infants} Infants</span>
                    </p>
                    <p className="font-semibold mt-1">Total: ${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              )} */}
              {booking && (
                <div
                  className="absolute left-[5rem] right-0 bg-custom-7 p-4 text-white text-sm rounded-md flex flex-col shadow-md"
                  style={{
                    height: `${(booking.totalDuration * 60) / interval * 3.5}rem`, // Convert hours to blocks
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{booking.title}</span>
                    <span className="text-sm">
                      {booking.time} - {formatTime(convert12HoursToMinutes(booking.time) + booking.totalDuration * 60)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs">
                    <p>
                      Guests: <span className="ml-1">{booking.guests.adults} Adults,</span>
                      <span className="ml-1">{booking.guests.children} Children,</span>
                      <span className="ml-1">{booking.guests.infants} Infants</span>
                    </p>
                    <p className="font-semibold mt-1">Total: ${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DaySchedule;
