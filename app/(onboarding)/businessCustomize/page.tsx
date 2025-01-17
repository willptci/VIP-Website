"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchBusinessData, updateBusinessField } from '@/lib/actions/business.actions'
import CustomizeCard from "@/components/ui/CustomizeCard";
import { DataTableDemo } from "@/components/ui/PackageTable";
import { ProfileCarousel } from "@/components/ui/ProfileCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react"
import NewPackage from "@/components/ui/new-package";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const businessOnboarding = () => {
  const [showCompanyName, setShowCompanyName] = useState(true);
  const [showCompanyDescription, setShowCompanyDescription] = useState(true);
  const [showWhoYouAre, setShowWhoYouAre] = useState(true);
  const [showPackages, setShowPackages] = useState(true);
  const [showContact, setShowContact] = useState(true);
  const [numberOfImages, setNumberOfImages] = useState(5);

  const router = useRouter();
  const [businessData, setBusinessData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState({
    companyName: false,
    companyDescription: false,
    ownerDescription: false,
    phoneNumber: false,
  });
  const [newPackage, setNewPackage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authId, setAuthId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setAuthId(uid);

        try {
          const data = await fetchBusinessData(uid);
          setBusinessData(data);
        } catch (error) {
          console.error("Error fetching business data:", error);
          alert("Failed to load business data.");
        }
      } else {
        alert("You must be logged in to access your business data.");
        router.push("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateField = async (field: string, value: string) => {
    try {
      setBusinessData((prev: any) => ({
        ...prev,
        [field]: value,
      }));

      await updateBusinessField(field, value);
  
      console.log(`Field "${field}" updated successfully in Firestore.`);
    } catch (error) {
      console.error(`Error updating field "${field}":`, error);
      alert("Failed to update field. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
    if (e.key === "Enter") {
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="p-10 h-full flex flex-col justify-center bg-grey-50">
      <div className="mb-5">
          <h1 className="text-36 font-bold text-black">My Business Page</h1>
      </div>
      <div className="flex">
        <div className="flex-col rounded-xl border p-10 shadow w-4/6">

          {showCompanyName && (
            <div className="flex gap-5 justify-center items-center">
              {isEditing.companyName ? (
                <Input
                  type="text"
                  value={businessData.companyName}
                  onChange={(e) => handleUpdateField("companyName", e.target.value)}
                  onBlur={() => setIsEditing((prev) => ({ ...prev, companyName: false }))}
                  onKeyDown={(e) => handleKeyDown(e, "companyName")}
                  className="text-36 font-bold text-black w-auto"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-36 font-bold text-black"
                  onClick={() => setIsEditing((prev) => ({ ...prev, companyName: true }))}
                >
                  {businessData.companyName}
                </h1>
              )}
            </div>
          )}

          {!showCompanyName && (
            <div className="flex gap-5 justify-center items-center">
              <h1
                className="text-36 font-bold text-black"
              >
                {businessData.firstName + " " + businessData.lastName}
              </h1>
            </div>
          )}

          {showCompanyDescription && (
            <div className="flex mt-10 justify-center items-center gap-10">
              {(numberOfImages > 0) && (
                <div className="border shadow w-[150px] h-36 rounded-xl"></div>
              )}
              {isEditing.companyDescription ? (
                <Input
                  type="text"
                  value={businessData.companyDescription}
                  onChange={(e) => handleUpdateField("companyDescription", e.target.value)}
                  onBlur={() => setIsEditing((prev) => ({ ...prev, companyDescription: false }))}
                  onKeyDown={(e) => handleKeyDown(e, "companyDescription")}
                  className="text-36 font-bold text-black w-auto"
                  autoFocus
                />
              ) : (
                <p
                  className="p-5"
                  onClick={() => setIsEditing((prev) => ({ ...prev, companyDescription: true }))}
                >
                  {businessData.companyDescription}
                </p>
              )}
            </div>
          )}

          {showWhoYouAre && (
            <div>
              {!showCompanyDescription ? (
                <div className="flex mt-10 justify-center items-center gap-10">
                  {(numberOfImages > 1) && (
                    <div className="flex-col">
                      <div className="border shadow w-[150px] h-36 rounded-xl"></div>
                      <p className="mt-2 text-center">{businessData.firstName + " " + businessData.lastName}</p>
                    </div>
                  )}
                  {isEditing.ownerDescription ? (
                    <Input
                      type="text"
                      value={businessData.ownerDescription}
                      onChange={(e) => handleUpdateField("ownerDescription", e.target.value)}
                      onBlur={() => setIsEditing((prev) => ({ ...prev, ownerDescription: false }))}
                      onKeyDown={(e) => handleKeyDown(e, "ownerDescription")}
                      className="text-36 font-bold text-black w-auto"
                      autoFocus
                    />
                  ) : (
                    <p
                      className="p-5"
                      onClick={() => setIsEditing((prev) => ({ ...prev, ownerDescription: true }))}
                    >
                      {businessData.ownerDescription}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex mt-10 justify-center items-center gap-10">
                  {isEditing.ownerDescription ? (
                    <Input
                      type="text"
                      value={businessData.ownerDescription}
                      onChange={(e) => handleUpdateField("ownerDescription", e.target.value)}
                      onBlur={() => setIsEditing((prev) => ({ ...prev, ownerDescription: false }))}
                      onKeyDown={(e) => handleKeyDown(e, "ownerDescription")}
                      className="text-36 font-bold text-black w-auto"
                      autoFocus
                    />
                  ) : (
                    <p
                      className="p-5"
                      onClick={() => setIsEditing((prev) => ({ ...prev, ownerDescription: true }))}
                    >
                      {businessData.ownerDescription}
                    </p>
                  )}
                  {(numberOfImages > 1) && (
                    <div className="flex-col">
                      <div className="border shadow w-[150px] h-36 rounded-xl"></div>
                      <p className="mt-2 text-center">{businessData.firstName + " " + businessData.lastName}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {showContact && (
            <div className="flex justify-center items-center p-5 gap-5">
              <p className="header-2">Contact me at</p>
              {isEditing.phoneNumber ? (
                <Input
                  type="text"
                  value={businessData.phoneNumber}
                  onChange={(e) => handleUpdateField("phoneNumber", e.target.value)}
                  onBlur={() => setIsEditing((prev) => ({ ...prev, phoneNumber: false }))}
                  onKeyDown={(e) => handleKeyDown(e, "phoneNumber")}
                  className="text-36 font-bold text-black w-auto"
                  autoFocus
                />
              ) : (
                <p
                  className="header-2"
                  onClick={() => setIsEditing((prev) => ({ ...prev, phoneNumber: true }))}
                >
                  {businessData.phoneNumber}
                </p>
              )}
            </div>
          )}

          {showPackages && (
            <div>
              <div className="p-5">
                <DataTableDemo/>
                <Button variant="secondary" className="flex-shrink-0 mt-3" onClick={() => setNewPackage(true)}><Plus/> add package</Button>
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
              showCompanyDescription,
              setShowCompanyDescription
            }}
            numberOfImages={numberOfImages}
            setNumberOfImages={setNumberOfImages}
          />
          {newPackage && (
            <NewPackage
              setNewPackage={setNewPackage}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default businessOnboarding