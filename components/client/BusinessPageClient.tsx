"use client";

import { DataTableDemo } from "@/components/ui/PackageTable";
import { PhotoCarousel } from "@/components/ui/ShowcasePhotoCarousel";
import Image from "next/image";
import { Package } from "@/types";
import { BookNowCard } from "../ui/BookNowCard";
import React from "react";

interface BusinessPageClientProps {
  businessData: any;
  packages: Package[];
}

export default function BusinessPageClient({
  businessData = {},
  packages = [],
}: BusinessPageClientProps) {
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(
    null
  );
  
  // Placeholder for missing images
  const getImage = (index: number, defaultSrc: string) =>
    businessData.photos?.[index] || defaultSrc;

  return (
    <div>
      {/* Header Section */}
      <section className="p-20 h-full flex flex-col justify-center bg-grey-50">
        <div className="pl-12 pb-8">
          <h1 className="text-6xl font-bold text-black">
            {businessData.settings?.showCompanyName
              ? businessData.companyName || "Business Name"
              : `${businessData.firstName || ""} ${businessData.lastName || ""}`}
          </h1>
        </div>

        {businessData.settings?.showCompanyDescription &&
          businessData.settings?.showWhoYouAre && (
            <div>
              {/* Description and First Image */}
              <div className="flex items-start gap-2 p-8">
                {getImage(0, "/default-image.jpg") ? (
                  <div className="w-[600px] h-[400px] overflow-hidden rounded-lg">
                    <Image
                      src={getImage(0, "/default-image.jpg")}
                      alt="Business Image"
                      width={600}
                      height={400}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <p>No images available</p>
                )}
                <div className="flex-1 pl-20">
                  <p className="text-2xl">
                    {businessData.settings.showCompanyDescription
                      ? businessData.companyDescription || "Description missing"
                      : businessData.ownerDescription || "Owner's description"}
                  </p>
                </div>
              </div>

              {/* Second Image and Who You Are */}
              <div className="flex items-start gap-2 p-8">
                <div className="flex-1 pr-20">
                  <p className="text-2xl">{businessData.companyDescription}</p>
                </div>
                {getImage(1, "/default-image.jpg") ? (
                  <div className="w-[400px] h-[300px] overflow-hidden rounded-lg">
                    <Image
                      src={getImage(1, "/default-image.jpg")}
                      alt="Business Image"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          )}
      </section>

      {/* Background Section */}
      <section
        className="h-[60vh] bg-fixed bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${getImage(2, "/default-background.jpg")})`,
        }}
      >
        <div className="text-white text-center bg-black bg-opacity-50 p-8 rounded-lg">
          <h2 className="text-4xl font-bold">Welcome to Our Business</h2>
          <p className="text-xl mt-4">
            Scroll to see more about{" "}
            {businessData.companyName || "our offerings"}!
          </p>
        </div>
      </section>

      {/* Packages and Booking Section */}
      <section className="p-4 h-full flex justify-center bg-grey-50">
        <div className="flex-col p-5 w-full ml-4 pt-14">
          <div>
            <p className="text-5xl font-semibold">Our Packages</p>
          </div>
          <div className="pb-10 pt-8">
            <DataTableDemo
              packages={packages}
              onSelectPackage={setSelectedPackage}
            />
          </div>
        </div>
        <div className="p-10">
          <BookNowCard
            businessName={businessData.companyName || "Business Name"}
            selectedPackage={selectedPackage}
          />
        </div>
      </section>
    </div>
  );
}