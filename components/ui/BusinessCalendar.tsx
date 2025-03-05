/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from "react";
import { DayContentProps, DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    bookingsPerDay?: Record<string, number>;
};

function BusinessCalendar({
  className,
  classNames,
  showOutsideDays = true,
  bookingsPerDay = {},
  ...props
}: CalendarProps) {

    const renderDayContent = (dayContentProps: DayContentProps) => {
        const dateKey = dayContentProps.date.toISOString().split('T')[0];
        const bookingsCount = bookingsPerDay[dateKey] || 0;

        return (
            <div className="relative flex items-center justify-center w-full h-full">
                <span>{dayContentProps.date.getDate()}</span>
                {bookingsCount > 0 && (
                    <span className="absolute top-2 right-2 bg-custom-6 text-black text-xs rounded-full px-2">
                    {bookingsCount}
                    </span>
                )}
            </div>
        );
    };

return (
    <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn("p-5 text-custom-8", className)}
    classNames={{
        months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-3xl font-medium",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex rounded-md bg-gray-100 pt-3 pb-3",
        head_cell:
        "text-muted-foreground w-full font-normal text-md",
        row: "flex w-full mt-2",
        cell: cn(
        "relative p-0 text-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
        props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
        buttonVariants({ variant: "ghost" }),
        "h-20 w-20 p-0 text-md hover:text-lg font-normal aria-selected:opacity-100 hover:bg-gray-200 hover:text-black rounded-md transition-colors hover:scale-105 transition-transform"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
        "bg-gray-200 text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "font-bold hover:bg-custom-9 border border-gray-200",
        day_outside:
        "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground text-white hover:text-custom-8 hover:bg-white hover:border",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
    }}
    components={{
        DayContent: renderDayContent,
        IconLeft: ({ className, children, ...props }) => (
        <ChevronLeftIcon className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, children, ...props }) => (
        <ChevronRightIcon className={cn("h-4 w-4", className)} {...props} />
        ),
    }}
    {...props}
    />
);
}
BusinessCalendar.displayName = "Business Calendar";

export { BusinessCalendar };