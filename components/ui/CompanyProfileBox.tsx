"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import defaultImage from '/public/icons/default_img.png';

interface CompanyProfileBoxProps {
    category: string;
    businessProduct: string;
    businessName: string;
    available: string;
    image: string;
}

const CompanyProfileBox: React.FC<CompanyProfileBoxProps> = ({ category, businessProduct, businessName, available, image }) => {
    const [imgSrc, setImgSrc] = useState(image);

    const handleError = () => {
        setImgSrc(defaultImage.src);
    };

    return (
        <Link href={`/tours/${encodeURIComponent(businessName)}`} className="company-profile-box">
            <div className="company-image-box">
                <Image
                    src={imgSrc}
                    alt={`${businessName} logo`}
                    onError={handleError}
                    className="company-profile-box-img"
                    width={1000}
                    height={1000}
                />
            </div>
            <div className="company-details">
                <h3 className="business-name">{businessName}</h3>
                <div>
                    <p className="business-product">{businessProduct}</p>
                    <p className={available === "sold out" ? "sold-out-class" : "available-class"}>
                        {available}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default CompanyProfileBox;
