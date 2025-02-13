"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthStore } from "@/state/authState";
import Andros_Logo from "@/public/icons/bonefish.svg";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import to check route

const ProfileNav: React.FC = () => {
  const role = useAuthStore((state) => state.role);
  const pathname = usePathname(); // Get current page route

  // Apply sticky only if NOT on the home page
  const navbarClasses = pathname === "/" 
    ? "bg-white" // Normal navbar on home
    : "sticky top-0 z-50 bg-white shadow-sm"; // Sticky on other pages

  return (
    <div className={navbarClasses}>
      {/* Navigation Bar Container */}
      <div className="flex items-center justify-between w-full px-5 py-2">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" passHref>
            <div className="flex items-center pl-8 cursor-pointer">
              <div className="relative w-[70px] h-[70px]">
                <Image
                  src={Andros_Logo}
                  alt="Logo"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>
              <h1 className="font-bold font-syne text-custom-8 text-4xl">Andros</h1>
            </div>
          </Link>
        </div>

        {/* Navigation Links Section */}
        <div className="ml-auto flex items-center space-x-8 font-syne text-2xl text-custom-8 pr-10">
          <Link href="/about" passHref>
            <div className="cursor-pointer hover:text-accent transition-colors">
              Us
            </div>
          </Link>
          {role === "guest" ? (
            <Link href="/sign-in" passHref>
              <div className="cursor-pointer hover:text-accent transition-colors">
                Sign In
              </div>
            </Link>
          ) : (
            <Link href="/profile" passHref>
              <div className="cursor-pointer hover:text-accent transition-colors">
                {role === "business" ? "My Business" : "Profile"}
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileNav;
