"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import defaultImage from '/public/icons/default_img.png';

interface CompanyProfileBoxProps {
  businessId: string
  businessProduct: string;
  businessName: string;
  firstName: string;
  lastName: string;
  image: string;
}

const CompanyProfileBox = ({
  businessId,
  businessProduct,
  businessName,
  firstName,
  lastName,
  image,
}: CompanyProfileBoxProps) => {
  const [imgSrc, setImgSrc] = useState(image);

  const handleError = () => {
    setImgSrc(defaultImage.src);
  };

  return (
    <Link href={{
      pathname: `/company/${businessId}`,
    }}
    passHref>
      <div className="w-80 h-[28rem] items-center rounded-xl border border-gray-200 p-3 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-center w-full h-72">
          <Image
            src={imgSrc}
            alt={`${businessName} logo`}
            onError={handleError}
            className="w-full h-full object-cover shadow-profile rounded-lg"
            width={1000}
            height={1000}
          />
        </div>
        <div className="flex flex-col justify-between p-3">
          <div className="flex flex-wrap items-center">
            <h3 className="text-3xl text-gray-900 overflow-hidden whitespace-nowrap font-bold text-ellipsis max-w-full">
              {businessName}
            </h3>
          </div>
          <div className="flex-col mt-2">
            <p className="text-lg font-normal p-0.5 text-gray-800">{businessProduct}</p>
            <p className= "font-normal text-gray-600 p-0.5 text-md">
              With {firstName + ' ' + lastName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyProfileBox;
