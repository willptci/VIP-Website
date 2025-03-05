"use client";

import { DataTableDemo } from "@/components/ui/PackageTable";
import { PhotoCarousel } from "@/components/ui/ShowcasePhotoCarousel";
import Image from "next/image";
import { Package } from "@/types";
import { BookNowCard } from "../ui/BookNowCard";
import React from "react";
import TopReviewsCarousel from "../ui/ShowReviews";

interface BusinessPageClientProps {
  businessData: any;
  packages: Package[];
  businessId: string;
}

export default function BusinessPageClient({
  businessData = {},
  packages = [],
  businessId = "",
}: BusinessPageClientProps) {
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(
    null
  );

  console.log(businessData)
  
  // Placeholder for missing images
  const getImage = (index: number, defaultSrc: string) =>
    businessData.photos?.[index] || defaultSrc;

  return (
    <div>
      {/* Header Section */}
      <section className="p-20 h-full flex flex-col justify-center text-custom-8 font-syne">
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
                      quality={100}
                      priority
                    />
                  </div>
                ) : (
                  <p>No images available</p>
                )}
                <div className="flex-1 pl-20">
                  <p className="text-2xl flex items-center justify-center text-center">
                    {businessData.settings.showCompanyDescription
                      ? businessData.companyDescription || "Description missing"
                      : businessData.ownerDescription || "Owner's description"}
                  </p>
                  <TopReviewsCarousel businessId={businessId}/>
                </div>
              </div>

              {/* Second Image and Who You Are */}
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="flex-1 flex items-center justify-center text-center max-w-2xl">
                  <p className="text-2xl leading-relaxed">{businessData.companyDescription}</p>
                </div>

                {getImage(1, "/default-image.jpg") ? (
                  <div className="w-[350px] h-[250px] overflow-hidden rounded-lg flex-shrink-0">
                    <Image
                      src={getImage(1, "/default-image.jpg")}
                      alt="Business Image"
                      width={350}
                      height={250}
                      className="rounded-lg object-cover w-full h-full"
                      quality={100}
                    />
                  </div>
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          )}
      </section>

      {/* Contact Section - Display if showContact is true and phoneNumber is not empty */}
      {businessData.settings?.showContact && businessData.phoneNumber && (
        <div className="flex justify-center items-center py-6">
          <p className="text-4xl text-custom-8 font-syne">Contact me at {businessData.phoneNumber}</p>
        </div>
      )}

      {/* Background Section */}
      {businessData.settings?.showBackground && (
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
      )}

      {/* Packages and Booking Section */}
      <section className="p-4 h-full flex justify-center text-custom-8 font-syne ">
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
        <div className="pt-10 pr-10">
          <BookNowCard
            businessName={businessData.companyName || "Business Name"}
            selectedPackage={selectedPackage}
            businessId={businessId || ""}
          />
        </div>
      </section>
    </div>
  );
}