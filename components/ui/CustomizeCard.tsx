"use client";
import React, { useState } from "react";
import { Plus, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import SliderWithNumber from "@/components/ui/NumberSlider";

const CustomizeCard: React.FC<CustomizeCardProps> = ({ switches, numberOfImages, setNumberOfImages, }) => {
  const {
    showCompanyName,
    setShowCompanyName,
    showWhoYouAre,
    setShowWhoYouAre,
    showPackages,
    setShowPackages,
    showContact,
    setShowContact,
    showCompanyDescription,
    setShowCompanyDescription
  } = switches;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize</CardTitle>
        <CardDescription>Which fields do you want to show on your page?</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Plus />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Company Name
            </p>
            <p className="text-sm text-muted-foreground">
              Your Company and its description.
            </p>
          </div>
          <Switch
            checked={showCompanyName}
            onCheckedChange={(checked) => setShowCompanyName(checked)}
          />
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Plus />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Advertise Your Business
            </p>
            <p className="text-sm text-muted-foreground">
              How would you describe your business?
            </p>
          </div>
          <Switch
            checked={showCompanyDescription}
            onCheckedChange={(checked) => setShowCompanyDescription(checked)}
          />
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Plus />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Who You Are?
            </p>
            <p className="text-sm text-muted-foreground">
              Your name and a bit about you.
            </p>
          </div>
          <Switch
            checked={showWhoYouAre}
            onCheckedChange={(checked) => setShowWhoYouAre(checked)}
          />
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Plus />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Packages You Offer
            </p>
            <p className="text-sm text-muted-foreground">
              Do you offer fixed packages?
            </p>
          </div>
          <Switch
            checked={showPackages}
            onCheckedChange={(checked) => setShowPackages(checked)}
          />
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Plus />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Your Preferred Contact
            </p>
            <p className="text-sm text-muted-foreground">
              How should clients contact you?
            </p>
          </div>
          <Switch
            checked={showContact}
            onCheckedChange={(checked) => setShowContact(checked)}
          />
        </div>
        <SliderWithNumber
          value={numberOfImages}
          onValueChange={(value) => setNumberOfImages(value)}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check /> Add all to website
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CustomizeCard