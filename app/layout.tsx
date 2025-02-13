export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from '@/state/AuthProvider';

const syne = localFont({
  src: [
    { path: "../public/fonts/Syne-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Syne-Medium.ttf", weight: "500" },
    { path: "../public/fonts/Syne-SemiBold.ttf", weight: "600" },
    { path: "../public/fonts/Syne-Bold.ttf", weight: "700" },
    { path: "../public/fonts/Syne-ExtraBold.ttf", weight: "800" },
  ],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "Andros",
  description: "Business Exchange Platform for tech community of Andros Island",
  icons: {
    icon: '/icons/bonefish.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={syne.variable}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
