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
  firstName?: string;
  lastName?: string;
  telephone?: string;
  description?: string;
  profileImagePath?: string;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};
