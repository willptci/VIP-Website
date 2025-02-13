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
      <div className="w-80 h-[28rem] items-center p-3 hover:shadow-lg  hover:shadow-custom-6 transition-shadow font-syne text-custom-8">
        <div className="flex justify-center w-full h-72">
          <Image
            src={imgSrc}
            alt={`${businessName} logo`}
            onError={handleError}
            className="w-full h-full object-cover rounded-lg"
            width={1000}
            height={1000}
          />
        </div>
        <div className="flex flex-col justify-between p-3">
          <div className="flex flex-wrap items-center">
            <h3 className="text-3xl overflow-hidden whitespace-nowrap font-semibold text-ellipsis max-w-full">
              {businessName}
            </h3>
          </div>
          <div className="flex-col mt-2">
            <p className="text-lg font-normal p-0.5">{businessProduct}</p>
            <p className= "font-normal text-custom-8 p-0.5 text-md">
              With {firstName + ' ' + lastName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyProfileBox;
