/* eslint-disable no-unused-vars */

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
  profilePhoto: string;
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
};

declare interface CustomizeCardProps {
  switches: {
    showCompanyName: boolean;
    setShowCompanyName: React.Dispatch<React.SetStateAction<boolean>>;
    showWhoYouAre: boolean;
    setShowWhoYouAre: React.Dispatch<React.SetStateAction<boolean>>;
    showPackages: boolean;
    setShowPackages: React.Dispatch<React.SetStateAction<boolean>>;
    showContact: boolean;
    setShowContact: React.Dispatch<React.SetStateAction<boolean>>;
    showCompanyDescription: boolean;
    setShowCompanyDescription: React.Dispatch<React.SetStateAction<boolean>>;
  };
  numberOfImages: number;
  setNumberOfImages: React.Dispatch<React.SetStateAction<number>>;
}

interface SliderWithNumberProps {
  value: number;
  onValueChange: (value: number) => void;
}

interface PackageProps {
  setNewPackage: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Package {
  id: string;
  amount: number;
  status: boolean;
  capacity: number;
  title: string;
}