"use client";
import React from "react";
import { Package } from "@/types";
import { PhotoCarousel } from "./ShowcasePhotoCarousel";
import { Button } from "./button";
import { Trash } from "lucide-react";

interface TableDropDownProps {
    packageData: Package;
    showDelete?: boolean;
    onDelete?: (id: string) => void;
}

const TableDropDown: React.FC<TableDropDownProps> = ({ packageData, showDelete = false, onDelete}) => {

    const handleDelete = () => {
        if (packageData.id) {
          onDelete?.(packageData.id); // Let parent handle deletion logic
        }
      };
    
    return (
        <div className="p-5 border rounded-lg shadow-md bg-white relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Package Details</h2>
            {showDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-100 text-red-600 absolute right-2 top-2"
                    onClick={handleDelete}
                >
                    <Trash className="w-5 h-5" />
                </Button>
            )}
            <div className={`flex ${packageData.photos?.length > 0 ? "justify-between items-center" : "justify-start"}`}>
                <div className="space-y-5 flex-1">
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
                <div className="flex p-10 ml-6">
                    <PhotoCarousel photos={packageData.photos}/>
                </div>
            </div>
        </div>
    );
}

export default TableDropDown;
