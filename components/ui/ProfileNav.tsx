"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Transaction Histroy",
    href: "/trips",
    description:
      "See the transaction history of your recent trips.",
  },
  {
    title: "Rate your Experience",
    href: "/rateExperience",
    description:
      "Rate your experience or personally let your captains know how they did!",
  },
  {
    title: "Upcoming Trips",
    href: "/upcomingTrips",
    description: "See your upcoming trips and their details.",
  },
  {
    title: "Request Cancellation or Refund",
    href: "/cancelOrRefund",
    description:
      "Your resource to cancel an upcoming trip or refund a past one.",
  },
]

const ProfileNav: React.FC = () => {
  return (
    <div className="pl-5 pt-3 pb-3 bg-white space-x-20 font-syne text-2xl text-custom-8">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/schedule" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Schedule
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/businessCustomize" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Edit Business
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Account</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="hover:bg-custom-9 flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/profile"
                  >
                    <img src="/icons/user.svg" alt="Custom Icon" width={100} height={100} className="mb-5 ml-3" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Profile
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Let your captains know a little about you!
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/security" title="Login and Security">
                Update your password and authenticate your account
              </ListItem>
              <ListItem href="/payment" title="Payment Method">
                Update or add your payment methods
              </ListItem>
              <ListItem href="/notifications" title="Notifications">
                Get notified for upcoming trips and their times
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Trips</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-custom-9 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default ProfileNav
