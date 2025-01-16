import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Plus } from "lucide-react";

export default function SliderWithNumber({
  value,
  onValueChange,
}: SliderWithNumberProps) {

  return (
    <div className="flex-col items-center space-x-4 rounded-md border p-4">
      <div className="flex space-x-4 pb-5">
        <Plus />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Number of Images?</p>
          <p className="text-sm text-muted-foreground">
            Choose how many to showcase.
          </p>
        </div>
        <div className="mt-2 pr-3 text-center">
          <p className="text-md font-medium">{value}</p>
        </div>
      </div>
      <div className="p-3 w-full">
        <Slider
          value={[value]}
          onValueChange={(newValue) => onValueChange(newValue[0])}
          max={7}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}
