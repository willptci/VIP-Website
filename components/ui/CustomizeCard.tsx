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
import { CustomizeCardProps } from "@/types";
import { saveNumberOfImages } from "@/lib/actions/business.actions";

const CustomizeCard: React.FC<CustomizeCardProps> = ({ switches }) => {
  const {
    showCompanyName,
    setShowCompanyName,
    showWhoYouAre,
    setShowWhoYouAre,
    showContact,
    setShowContact,
    showCompanyDescription,
    setShowCompanyDescription,
    showBackground,
    setShowBackground,
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
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Plus />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Background Image?
            </p>
            <p className="text-sm text-muted-foreground">
              Seperates description and packages.
            </p>
          </div>
          <Switch
            checked={showBackground}
            onCheckedChange={(checked) => setShowBackground(checked)}
          />
        </div>
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