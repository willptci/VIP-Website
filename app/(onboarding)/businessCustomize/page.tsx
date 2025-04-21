"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBusinessPackage, fetchBusinessData, fetchBusinessPackages, fetchShowcasingBusinessPackages, saveSettings, updateBusinessField, uploadPhotoForBusiness } from '@/lib/actions/business.actions'
import CustomizeCard from "@/components/ui/CustomizeCard";
import { DataTableDemo } from "@/components/ui/PackageTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Package } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import AddPackage from "@/components/ui/AddPackage";
import { toast } from "sonner"

const BusinessOnboarding = () => {
  const [showCompanyName, setShowCompanyName] = useState(true);
  const [showCompanyDescription, setShowCompanyDescription] = useState(true);
  const [showWhoYouAre, setShowWhoYouAre] = useState(true);
  const [showContact, setShowContact] = useState(true);
  const [showBackground, setShowBackground] = useState(true);

  // const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(
  //   null
  // );
  const setSelectedPackage = React.useState<Package | null>()[1]; // Keep only the setter

  const router = useRouter();
  interface BusinessData {
    companyName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    companyDescription?: string;
    ownerDescription?: string;
    photos?: string[];
    backgroundImage?: string;
  }
  
  const [businessData, setBusinessData] = useState<BusinessData>({} as BusinessData);

  const [isEditing, setIsEditing] = useState({
    companyName: false,
    companyDescription: false,
    ownerDescription: false,
    phoneNumber: false,
  });
  const [loading, setLoading] = useState(true);
  const [authId, setAuthId] = useState<string | null>(null);

  const [tableData, setTableData] = useState<Package[]>([]);

  console.log(tableData)

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setAuthId(uid);

        try {
          const data = await fetchBusinessData(uid);
          setBusinessData(data);

          //might need to optimize
          const packages = await fetchShowcasingBusinessPackages(uid);
          setTableData(packages);
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
      setBusinessData((prev: BusinessData) => ({
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (e.key === "Enter") {
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleImageUpload = (index: number) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && authId) {
        try {
          const photoUrl = await uploadPhotoForBusiness(file, authId);
          setBusinessData((prev: BusinessData) => {
            const updatedPhotos = [...(prev.photos || [])];
            updatedPhotos[index] = photoUrl; // Replace or add the photo
            return { ...prev, photos: updatedPhotos };
          });
        } catch (error) {
          console.error("Error uploading photo:", error);
        }
      }
    };
    fileInput.click();
  };

  const handleDelete = async (id: string) => {
    try {
      if (!authId) return;
  
      await deleteBusinessPackage(id, authId!);
      setTableData((prev) => prev.filter((pkg) => pkg.id !== id));
  
      toast("Package Deleted", {
        description: "The package was successfully removed.",
      });
    } catch (error) {
      toast("Delete Failed", {
        description: "An error occurred while deleting the package.",
      });
    }
  };

  const navigateToHome = async () => {
    try {

      if (showCompanyDescription && !businessData.photos?.[0]) {
        toast("Missing Required Image", {
          description: "Please upload a photo for the Company Description section.",
        });
        return;
      }

      if (showWhoYouAre && !businessData.photos?.[1]) {
        toast("Missing Required Image", {
          description: "Please upload a photo for the Company Description section.",
        });
        return;
      }

      if (showBackground && !businessData.photos?.[2]) {
        toast("Missing Required Image", {
          description: "Please upload a photo for the Company Description section.",
        });
        return;
      }

      const settings = {
        showCompanyName,
        showCompanyDescription,
        showWhoYouAre,
        showContact,
        showBackground,
      };

      await saveSettings(settings);
      router.push("/");
    } catch (error) {
      toast("Save Failed", {
        description: "Please try again later.",
      });
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="p-10 h-full flex flex-col justify-center font-syne text-custom-8 bg-custom-9 ">
      <div className="mb-5 font-extrabold gap-6 flex">
          <h1 className="text-36 font-bold text-black">My Business Page</h1>
          <Button onClick={navigateToHome} className="p-6 bg-custom-6 rounded-md text-white hover:bg-custom-1 hover:text-custom-8 text-3xl"> Save </Button>
      </div>
      <div className="flex">
        <div className="flex-col rounded-xl border p-10 shadow w-4/6 bg-white">

          {showCompanyName && (
            <div className="flex gap-5 justify-center items-center">
              {isEditing.companyName || !businessData.companyName ? (
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
                <div>
                  {businessData.photos?.[0] ? (
                    <div
                      className="relative border shadow w-[150px] h-36 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${businessData.photos[0]})` }}
                    >
                      <Button
                        variant="secondary"
                        className="absolute top-1 right-1 p-1 w-6 h-6 rounded-full flex items-center justify-center"
                        onClick={() => handleImageUpload(0)}
                      >
                        <Plus className=""/>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      className=""
                      onClick={() => handleImageUpload(0)}
                    >
                      <Plus /> Add Image
                    </Button>
                  )}
                </div>
              {isEditing.companyDescription || !businessData.companyDescription ? (
                <Textarea
                value={businessData.companyDescription}
                onChange={(e) => handleUpdateField("companyDescription", e.target.value)}
                onBlur={() => setIsEditing((prev) => ({ ...prev, companyDescription: false }))}
                onKeyDown={(e) => handleKeyDown(e, "companyDescription")}
                className="w-full h-28 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
                    <div className="flex-col">
                      <div>
                        {businessData.photos?.[1] ? (
                          <div
                            className="relative border shadow w-[150px] h-36 rounded-xl bg-cover bg-center"
                            style={{ backgroundImage: `url(${businessData.photos[1]})` }}
                          >
                            <Button
                              variant="secondary"
                              className="absolute top-1 right-1 p-1 w-6 h-6 rounded-full flex items-center justify-center"
                              onClick={() => handleImageUpload(1)}
                            >
                              <Plus className=""/>
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="secondary"
                            className=""
                            onClick={() => handleImageUpload(1)}
                          >
                            <Plus /> Add Image
                          </Button>
                        )}
                      </div>
                      {showCompanyName && (
                        <p className="mt-2 text-center">{businessData.firstName + " " + businessData.lastName}</p>
                      )}
                    </div>
                  {isEditing.ownerDescription || !businessData.ownerDescription ? (
                    <Textarea
                      value={businessData.ownerDescription}
                      onChange={(e) => handleUpdateField("ownerDescription", e.target.value)}
                      onBlur={() => setIsEditing((prev) => ({ ...prev, ownerDescription: false }))}
                      onKeyDown={(e) => handleKeyDown(e, "ownerDescription")}
                      className="w-full h-28 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
                    <Textarea
                      value={businessData.ownerDescription}
                      onChange={(e) => handleUpdateField("ownerDescription", e.target.value)}
                      onBlur={() => setIsEditing((prev) => ({ ...prev, ownerDescription: false }))}
                      onKeyDown={(e) => handleKeyDown(e, "ownerDescription")}
                      className="w-full h-28 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
                    <div className="flex-col">
                      <div>
                        {businessData.photos?.[1] ? (
                          <div
                            className="relative border shadow w-[150px] h-36 rounded-xl bg-cover bg-center"
                            style={{ backgroundImage: `url(${businessData.photos[1]})` }}
                          >
                            <Button
                              variant="secondary"
                              className="absolute top-1 right-1 p-1 w-6 h-6 rounded-full flex items-center justify-center"
                              onClick={() => handleImageUpload(1)}
                            >
                              <Plus className=""/>
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="secondary"
                            className=""
                            onClick={() => handleImageUpload(1)}
                          >
                            <Plus /> Add Image
                          </Button>
                        )}
                      </div>
                      {showCompanyName && (
                        <p className="mt-2 text-center">{businessData.firstName + " " + businessData.lastName}</p>
                      )}
                    </div>
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

          {showBackground && (
            <section
              className="h-[60vh] bg-fixed bg-cover bg-center flex items-center justify-center bg-slate-300"
              style={{
                backgroundImage: businessData?.photos?.[2]
                  ? `url(${businessData.photos[2]})`
                  : 'none',
              }}
            >
              <div className="text-white text-center bg-black bg-opacity-50 p-8 rounded-lg">
                <h2 className="text-4xl font-bold">Welcome to Our Business</h2>
                <p className="text-xl mt-4">
                  Scroll to see more about {businessData.companyName || "our offerings"}!
                </p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => handleImageUpload(2)}
                  >
                    {businessData?.photos?.[2] ? "Change Background" : "Add Background"}
                  </Button>
                </div>
              </div>
            </section>
          )}

            <div>
              <div className="p-5">
                <DataTableDemo packages={tableData} onSelectPackage={setSelectedPackage} allowDelete={true} onDelete={handleDelete}/>
                <div className="pt-4 rounded-t-lg">
                  <AddPackage 
                    addPackage={(newPackage: Package) =>
                      setTableData((prev) => [...prev, newPackage])
                    }
                  />
                </div>
              </div>
                <div className="p-5 ml-10 mr-10">
                  {/* <ProfileCarousel
                    photos={businessData?.photos || []} // Pass photos array
                    numberOfImages={numberOfImages - 2} // Exclude the first two images
                    setNumberOfImages={setNumberOfImages}
                    handleImageUpload={handleImageUpload}
                  /> */}
                </div>
            </div>
        </div>
        <div className="pl-10 w-auto">
          <CustomizeCard
            switches={{
              showCompanyName,
              setShowCompanyName,
              showWhoYouAre,
              setShowWhoYouAre,
              showContact,
              setShowContact,
              showCompanyDescription,
              setShowCompanyDescription,
              showBackground,
              setShowBackground,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default BusinessOnboarding