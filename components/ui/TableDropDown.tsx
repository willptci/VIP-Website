"use client";
import React from "react";
import { Package } from "@/types";
import { PhotoCarousel } from "./ShowcasePhotoCarousel";

interface TableDropDownProps {
    packageData: Package;
}

const TableDropDown: React.FC<TableDropDownProps> = ({ packageData }) => {
    
    return (
        <div className="p-5 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Package Details</h2>
            <div className="flex gap-4">
                <div className="space-y-3 flex-col">
                    {/* What you'll do */}
                    <div>
                        <p className="text-lg font-medium text-gray-700">What you'll do:</p>
                        <p className="text-gray-600">{packageData.what || "No description provided."}</p>
                    </div>

                    {/* How long */}
                    <div>
                        <p className="text-lg font-medium text-gray-700">How long:</p>
                        <p className="text-gray-600">{packageData.time || "Duration not specified."}</p>
                    </div>

                    {/* What we include */}
                    <div>
                        <p className="text-lg font-medium text-gray-700">What we include:</p>
                        <p className="text-gray-600">{packageData.included || "No inclusions specified."}</p>
                    </div>

                    {/* What to bring */}
                    <div>
                        <p className="text-lg font-medium text-gray-700">What to bring:</p>
                        <p className="text-gray-600">{packageData.bring || "No recommendations provided."}</p>
                    </div>
                </div>
                <div>
                    <PhotoCarousel photos={packageData.photos}/>
                </div>
            </div>
        </div>
    );
}

export default TableDropDown;
