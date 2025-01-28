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

export default function BusinessPageClient({ businessData, packages }: BusinessPageClientProps) {
    const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(
        null
      );

    return (
        <div>
        <section className="p-20 h-full flex flex-col justify-center bg-grey-50">
            <div className="pl-12 pb-8">
            <h1 className="text-6xl font-bold text-black">
                {businessData.settings.showCompanyName
                ? businessData.companyName
                : `${businessData.firstName} ${businessData.lastName}`}
            </h1>
            </div>
            {businessData.settings.showCompanyDescription && businessData.settings.showWhoYouAre && (
            <div>
                <div className="flex items-start gap-2 p-8">
                {businessData.settings.numberOfImages > 0 && (
                    businessData.photos?.[0] ? (
                    <div className="w-[600px] h-[400px] overflow-hidden rounded-lg">
                        <Image
                        src={businessData.photos[0]}
                        alt="Business Image"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                    ) : (
                    <p>No images available</p>
                    )
                )}
                {businessData.settings.showCompanyDescription ? (
                    <div className="flex-1 pl-20">
                    <p className="text-2xl">{businessData.companyDescription}</p>
                    </div>
                ) : (
                    <div className="flex-1 pl-20">
                    <p className="text-2xl">{businessData.ownerDescription}</p>
                    </div>
                )}
                </div>
                <div className="flex items-start gap-2 p-8">
                {businessData.settings.showWhoYouAre && (
                    <div className="flex-1 pr-20">
                    <p className="text-2xl">{businessData.companyDescription}</p>
                    </div>
                )}
                {businessData.settings.numberOfImages > 1 && (
                    businessData.photos?.[1] ? (
                    <div className="w-[400px] h-[300px] overflow-hidden rounded-lg">
                        <Image
                        src={businessData.photos[1]}
                        alt="Business Image"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                    ) : (
                    <p>No images available</p>
                    )
                )}
                </div>
            </div>
            )}
        </section>

        <section
            className="h-[60vh] bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{
            backgroundImage: `url(${businessData.photos?.[0] || "/default-background.jpg"})`,
            }}
        >
            <div className="text-white text-center bg-black bg-opacity-50 p-8 rounded-lg">
            <h2 className="text-4xl font-bold">Welcome to Our Business</h2>
            <p className="text-xl mt-4">
                Scroll to see more about {businessData.companyName || "our offerings"}!
            </p>
            </div>
        </section>

        <section className="p-4 h-full flex justify-center bg-grey-50">
            <div className="flex-col p-5 w-full ml-4 pt-14">
                <div>
                    <p className="text-5xl semi-bold">Our Packages</p>
                </div>
                <div className="pb-10 pt-8">
                    <DataTableDemo packages={packages} onSelectPackage={setSelectedPackage}/>
                </div>
                {/* <div className="p-10">
                    <PhotoCarousel photos={businessData.photos || []} />
                </div> */}
            </div>
            <div className="p-10">
                <BookNowCard businessName={businessData.companyName} selectedPackage={selectedPackage}/>
            </div>
        </section>
        </div>
    );
}
