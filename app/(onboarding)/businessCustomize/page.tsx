"use client";
import CustomizeCard from "@/components/ui/CustomizeCard";
import { DataTableDemo } from "@/components/ui/PackageTable";
import React, { useState } from "react";
import { ProfileCarousel } from "@/components/ui/ProfileCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react"
import NewPackage from "@/components/ui/new-package";

const businessOnboarding = () => {
  const [showCompanyName, setShowCompanyName] = useState(true);
  const [showCompanyDescription, setShowCompanyDescription] = useState(true);
  const [showWhoYouAre, setShowWhoYouAre] = useState(true);
  const [showPackages, setShowPackages] = useState(true);
  const [showContact, setShowContact] = useState(true);
  const [numberOfImages, setNumberOfImages] = useState(5);

  const [companyName, setCompanyName] = useState("Company Name");
  const [isEditingCompanyName, setIsEditingCompanyName] = useState(false);

  const [companyDescription, setCompanyDescription] = useState("Company Description");
  const [isEditingCompanyDescription, setIsEditingCompanyDescription] = useState(false);

  const [whoYouAre, setWhoYouAre] = useState("Show who you are");
  const [isEditingWhoYouAre, setIsEditingWhoYouAre] = useState(false);

  const [contact, setContact] = useState("***-***-****");
  const [isEditingContact, setIsEditingContact] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingCompanyName(false);
    }
  };

  return (
    <section className="p-10 h-full flex flex-col justify-center bg-grey-50">
      <div className="mb-5">
          <h1 className="text-36 font-bold text-black">My Business Page</h1>
      </div>
      <div className="flex">
        <div className="flex-col rounded-xl border p-10 shadow w-4/6">

          {showCompanyName && (
            <div className="flex gap-5 justify-center items-center">
              {isEditingCompanyName ? (
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onBlur={() => setIsEditingCompanyName(false)}
                  onKeyDown={handleKeyDown}
                  className="text-36 font-bold text-black w-auto"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-36 font-bold text-black"
                  onClick={() => setIsEditingCompanyName(true)}
                >
                  {companyName}
                </h1>
              )}
            </div>
          )}

          {showCompanyDescription && (
            <div className="flex mt-10 justify-center items-center gap-10">
              {(numberOfImages > 0) && (
                <div className="border shadow w-[150px] h-36 rounded-xl"></div>
              )}
              {isEditingCompanyDescription ? (
                <Input
                  type="text"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  onBlur={() => setIsEditingCompanyDescription(false)}
                  onKeyDown={handleKeyDown}
                  className="text-36 font-bold text-black w-auto"
                  autoFocus
                />
              ) : (
                <p
                  className="p-5"
                  onClick={() => setIsEditingCompanyDescription(true)}
                >
                  {companyDescription}
                </p>
              )}
            </div>
          )}

          {showWhoYouAre && (
            <div className="flex mt-10 justify-center items-center gap-10">
              {isEditingWhoYouAre ? (
                <Input
                  type="text"
                  value={whoYouAre}
                  onChange={(e) => setWhoYouAre(e.target.value)}
                  onBlur={() => setIsEditingWhoYouAre(false)}
                  onKeyDown={handleKeyDown}
                  className="text-36 font-bold text-black w-auto"
                  autoFocus
                />
              ) : (
                <p
                  className="p-5"
                  onClick={() => setIsEditingWhoYouAre(true)}
                >
                  {whoYouAre}
                </p>
              )}
              {(numberOfImages > 1) && (
                <div className="flex-col">
                  <div className="border shadow w-[150px] h-36 rounded-xl"></div>
                  <p className="mt-2 text-center">Will Parrish</p>
                </div>
              )}
            </div>
          )}

          {showContact && (
            <div className="flex justify-center items-center p-5 gap-5">
              <p className="header-2">Contact me at</p>
              {isEditingContact ? (
                <Input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  onBlur={() => setIsEditingContact(false)}
                  onKeyDown={handleKeyDown}
                  className="text-36 font-bold text-black w-auto"
                  autoFocus
                />
              ) : (
                <p
                  className="header-2"
                  onClick={() => setIsEditingContact(true)}
                >
                  {contact}
                </p>
              )}
            </div>
          )}

          {showPackages && (
            <div>
              <div className="p-5">
                <DataTableDemo/>
                <Button variant="secondary" className="flex-shrink-0 mt-3"><Plus/> add package</Button>
              </div>
              {(numberOfImages > 2) && (
                <div className="p-5 ml-10 mr-10">
                  <ProfileCarousel numberOfImages={numberOfImages - 2}/>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="pl-10 w-auto">
          <CustomizeCard
            switches={{
              showCompanyName,
              setShowCompanyName,
              showWhoYouAre,
              setShowWhoYouAre,
              showPackages,
              setShowPackages,
              showContact,
              setShowContact,
            }}
            numberOfImages={numberOfImages}
            setNumberOfImages={setNumberOfImages}
          />
          <NewPackage/>
        </div>
      </div>
    </section>
  );
}

export default businessOnboarding