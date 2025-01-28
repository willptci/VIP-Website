"use client";
import React from "react";
import { Package } from "@/types";

interface TableDropDownProps {
    packageData: Package;
}

const TableDropDown: React.FC<TableDropDownProps> = ({ packageData }) => {
    
    return (
        <div>
            <div>
                <p className="text-xl font-semibold">
                    {packageData.title}
                </p>
            </div>
        </div>
    );
}

export default TableDropDown;