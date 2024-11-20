"use client";
import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import defaultImage from '/public/icons/default_img.png';

interface CompanyProfileBoxProps {
    category: string;
    businessProduct: string;
    businessName: string;
    firstName: string;
    lastName: string;
    image: string;
  }
  
const CompanyProfileBox = ({ category, businessProduct, businessName, firstName, lastName, image }: CompanyProfileBoxProps) => {
    const [imgSrc, setImgSrc] = useState(image);

    const handleError = () => {
        setImgSrc(defaultImage.src);
    };

  return (
    <Link href={`/company/${encodeURIComponent(businessName)}`} passHref>
    <div className="company-profile-box">
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
          <p className="business-guide">
            With {firstName + " " + lastName}
          </p>
        </div>
      </div>
    </div>
  </Link>
  );
};

export default CompanyProfileBox