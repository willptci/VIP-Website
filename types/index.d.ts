/* eslint-disable no-unused-vars */

import { saveNumberOfImages } from "@/lib/actions/business.actions";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare interface CompanyProfileBoxProps {
  category: string;
  businessProduct: string;
  businessName: string;
  available: "sold out" | "available";
  image: string;
}

// ========================================

declare interface getUserInfoProps {
  userId: string;
}

declare type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "user" | "business";
};

declare type SignInProps = {
  email: string;
  password: string;
}

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  uid: string;
  role: "business" | "user";
  email: string;
  firstName: string;
  lastName: string;
  telephone?: string;
  description?: string;
  profileImageUrl?: string;
  isVerified: boolean;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Business = {
  ownerId: string,
  companyId: string,
  companyName?: string;
  firstName: string;
  lastName: string;
  ownerDescription?: string;
  companyDescription?: string;
  phoneNumber: string;
  email?: string;
  packages?: string[];
  reviews?: string[];
  photos?: string[];
  settingsId: string;
};

declare interface CustomizeCardProps {
  switches: {
    showCompanyName: boolean;
    setShowCompanyName: React.Dispatch<React.SetStateAction<boolean>>;
    showWhoYouAre: boolean;
    setShowWhoYouAre: React.Dispatch<React.SetStateAction<boolean>>;
    // showPackages: boolean;
    // setShowPackages: React.Dispatch<React.SetStateAction<boolean>>;
    showContact: boolean;
    setShowContact: React.Dispatch<React.SetStateAction<boolean>>;
    showCompanyDescription: boolean;
    setShowCompanyDescription: React.Dispatch<React.SetStateAction<boolean>>;
    showBackground: boolean;
    setShowBackground: React.Dispatch<React.SetStateAction<boolean>>;
  };
  // numberOfImages: number;
  // setNumberOfImages: React.Dispatch<React.SetStateAction<number>>;
}

interface SliderWithNumberProps {
  value: number;
  onValueChange: (value: number) => void;
}

export interface Package {
  id: string;
  amount: string;
  status: boolean;
  capacity: string;
  title: string;
  createdAt: string;
  per: string;
  what: string;
  time: string;
  included: string;
  bring: string;
  total: number;
  photos: string[];
}

interface NewPackageProps {
  addPackage: (newPackage: Package) => void;
  // setNewPackage: (value: boolean) => void;
}

export interface BusinessData {
  companyName: string;
  firstName: string;
  lastName: string;
  photos?: string[];
  settingsId: string;
  phoneNumber: string;
  ownerDescription?: string;
  companyDescription?: string;
  packages?: string[];
  settingsId: string;
  // reviews?: string[];
}

export interface SettingsData {
  showCompanyName: boolean;
  showCompanyDescription: boolean;
  showWhoYouAre: boolean;
  showPackages: boolean;
  showContact: boolean;
  numberOfImages: number;
}

export interface ShowcasingBusinessData extends BusinessData {
  settings: SettingsData;
}

export interface booking {
  id: string;
  businessId: string;
  customerId: string;
  packageId?: string;
  date: string;
  time: string;
  timestamp: Timestamp;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  totalCost: number;
  status: 'upcoming' | 'completed' | 'canceled';
  notes?: string;
  createdAt: Timestamp;
  // updatedAt: Timestamp;
  paymentStatus?: 'paid' | 'pending' | 'failed';
  durationMinutes?: number;
  location?: string;
  assignedStaffId?: string;
}

export interface BusinessAvailability {
  businessId: string;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface BusinessTimeSlot {
  businessId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
