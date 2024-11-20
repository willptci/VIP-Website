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
  $id: string;
  email: string;
  userId: string;
  business?: boolean;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  description?: string;
  profileImageId?: string;
  businessId?: string;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Business = {
  businessId?: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  description?: string;
  preferredContact: string;
  charges: string;
  offer: string;
  images?: string[];
};

declare interface CompanyDocument {
  image: string;
  $id: string;
  companyName: string;
  firstName: string;
  lastName: string;
}