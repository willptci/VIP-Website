"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { fetchBusinessData, fetchBusinessPackages, updateBusinessField, uploadPhotoForBusiness } from '@/lib/actions/business.actions';
import CustomizeCard from "@/components/ui/CustomizeCard";
import ComponentPalette from "@/components/ui/ComponentPalette";
import { DataTableDemo } from "@/components/ui/PackageTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Package, TextComponentType } from "@/types";
import AddPackage from "@/components/ui/AddPackage";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { RowData, SectionComponent } from "@/types";
import { Input } from "@/components/ui/input";
import TextComponentRenderer from "@/components/ui/TextComponentRenderer";

interface TextComponent extends SectionComponent {
  textType?: TextComponentType;
  textIndex?: number;
  showDropdown?: boolean;
}

interface BusinessDataType {
  companyName?: string;
  companyDescription?: string;
  ownerDescription?: string;
  phoneNumber?: string;
  photos?: string[];
  customText?: string[];
  [key: string]: any;
}

const BusinessOnboarding = () => {
  const router = useRouter();
  const [authId, setAuthId] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessDataType>({});
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<Package[]>([]);
  const setSelectedPackage = React.useState<Package | null>()[1];

  const [layoutRows, setLayoutRows] = useState<RowData[]>([{
    id: uuidv4(),
    left: { layout: "vertical", items: [] },
    right: { layout: "vertical", items: [] },
  }]);

  const [availableComponents] = useState<SectionComponent[]>([
    { id: uuidv4(), type: "photo" },
    { id: uuidv4(), type: "text" },
    { id: uuidv4(), type: "profile-picture" },
    { id: uuidv4(), type: "reviews" },
    { id: uuidv4(), type: "contact" },
    { id: uuidv4(), type: "background-photo" },
  ]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthId(user.uid);
        try {
          const data = await fetchBusinessData(user.uid);
          const mergedData: BusinessDataType = {
            customText: [],
            ...data,
          };
          setBusinessData(mergedData);
          const packages = await fetchBusinessPackages();
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

  useEffect(() => {
    const handleSetTextType = (e: Event) => {
      const { componentId, textType, textIndex } = (e as CustomEvent).detail;

      setLayoutRows(prev => {
        let newIndex = -1;
        const updatedRows = prev.map(row => {
          const updatedRow = { ...row };
          for (const side of ["left", "right"] as const) {
            updatedRow[side].items = updatedRow[side].items.map(item => {
              if (item.id === componentId && item.type === "text") {
                const textItem = item as TextComponent;
                textItem.textType = textType;
                textItem.showDropdown = false;
                if (textType === "new") {
                  newIndex = (businessData.customText?.length || 0);
                  textItem.textIndex = newIndex;
                }
              }
              return item;
            });
          }
          return updatedRow;
        });

        if (textType === "new" && newIndex !== -1) {
          setBusinessData(prev => {
            const newCustomText = [...(prev.customText ?? []), ""];
            void updateBusinessField("customText", JSON.stringify(newCustomText));
            return { ...prev, customText: newCustomText };
          });
        }

        return updatedRows;
      });
    };

    window.addEventListener("set-text-type", handleSetTextType);
    return () => window.removeEventListener("set-text-type", handleSetTextType);
  }, [businessData.customText]);

  const handleUpdateField = async (field: string, value: any) => {
    try {
      setBusinessData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
      await updateBusinessField(field, typeof value === "string" ? value : JSON.stringify(value));
      console.log(`Field "${field}" updated successfully.`);
    } catch (error) {
      console.error(`Error updating field "${field}":`, error);
      alert("Failed to update field. Please try again.");
    }
  };

  const renderComponent = (component: SectionComponent) => {
    switch (component.type) {
      case "text":
        return (
          <TextComponentRenderer
            component={component as TextComponent}
            businessData={businessData}
            updateComponentText={(id, newText) => {
              setLayoutRows(prev => {
                const updated = [...prev];
                for (const row of updated) {
                  for (const side of ["left", "right"] as const) {
                    const idx = row[side].items.findIndex(i => i.id === id);
                    if (idx !== -1) {
                      row[side].items[idx].value = newText;
                    }
                  }
                }
                return updated;
              });
              if ((component as TextComponent).textType === "new" && typeof (component as TextComponent).textIndex === "number") {
                const updatedCustomText = [...(businessData.customText ?? [])];
                updatedCustomText[(component as TextComponent).textIndex!] = newText;
                handleUpdateField("customText", updatedCustomText);
              }
            }}
            handleUpdateField={handleUpdateField}
          />
        );
      default:
        return null;
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
          setBusinessData((prev: any) => {
            const updatedPhotos = [...(prev.photos || [])];
            updatedPhotos[index] = photoUrl;
            return { ...prev, photos: updatedPhotos };
          });
        } catch (error) {
          console.error("Error uploading photo:", error);
        }
      }
    };
    fileInput.click();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const [srcRowIdx, srcZone] = result.source.droppableId.split("-");
    const [destRowIdx, destZone] = result.destination.droppableId.split("-");
    const updated = [...layoutRows];

    if (result.source.droppableId === "palette") {
      const from = availableComponents[result.source.index];
      const nextPhotoIndex = Math.max( -1, ...updated.flatMap(r => ["left", "right"].flatMap(k => r[k as "left" | "right"].items.map(i => i.photoIndex ?? -1))
    )
  ) + 1;
      const newComponent: SectionComponent = {
        id: uuidv4(),
        type: from.type,
        ...(from.type === "text" && { textType: undefined, showDropdown: true, value: "" }),
        ...(["photo", "profile-picture", "background-photo"].includes(from.type) && { photoIndex: nextPhotoIndex })
      };
      updated[parseInt(destRowIdx)][destZone as "left" | "right"].items.splice(result.destination.index, 0, newComponent);
      setLayoutRows(updated);
      return;
    }

    const sourceItems = [...updated[parseInt(srcRowIdx)][srcZone as "left" | "right"].items];
    const destItems = [...updated[parseInt(destRowIdx)][destZone as "left" | "right"].items];
    const [moved] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, moved);
    updated[parseInt(srcRowIdx)][srcZone as "left" | "right"].items = sourceItems;
    updated[parseInt(destRowIdx)][destZone as "left" | "right"].items = destItems;
    setLayoutRows(updated);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="p-10 h-full flex flex-col justify-center font-syne text-custom-8 bg-custom-9">
      <div className="mb-5 font-extrabold gap-6 flex">
        <h1 className="text-36 font-bold text-black">My Business Page</h1>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex">
          <div className="flex-col rounded-xl border p-10 shadow w-4/6 bg-white">
            {businessData.companyName && (
              <h2 className="text-2xl font-bold text-center mb-6">{businessData.companyName}</h2>
            )}

            {layoutRows.map((row, rowIndex) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {["left", "right"].map((zoneKey) => (
                  <div key={zoneKey} className={`flex ${row[zoneKey as "left" | "right"].layout === "horizontal" ? "flex-row" : "flex-col"} gap-4`}>
                    {row[zoneKey as "left" | "right"].items.map((item) => (
                      <div key={item.id}>{renderComponent(item)}</div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-2">Available Packages</h2>
              <DataTableDemo packages={tableData} onSelectPackage={setSelectedPackage} />
              <AddPackage addPackage={(pkg) => setTableData((prev) => [...prev, pkg])} />
            </div>
          </div>

          <div className="pl-10 w-auto">
            <ComponentPalette components={availableComponents} />
            <CustomizeCard rows={layoutRows} setRows={setLayoutRows} />
          </div>
        </div>
      </DragDropContext>
    </section>
  );
};

export default BusinessOnboarding;