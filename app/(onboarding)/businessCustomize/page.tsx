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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import TextComponentRenderer from "@/components/ui/TextComponentRenderer";

interface TextComponent extends SectionComponent {
  textType?: TextComponentType;
  textIndex?: number;
}

const BusinessOnboarding = () => {
  const router = useRouter();
  const [authId, setAuthId] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<any>({});
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
    { id: uuidv4(), type: "booking" },
    { id: uuidv4(), type: "packages" },
  ]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthId(user.uid);
        try {
          const data = await fetchBusinessData(user.uid);
          setBusinessData(data);
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

  const handleUpdateField = async (field: string, value: string) => {
    try {
      setBusinessData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
  
      await updateBusinessField(field, value);
  
      console.log(`Field "${field}" updated successfully.`);
    } catch (error) {
      console.error(`Error updating field "${field}":`, error);
      alert("Failed to update field. Please try again.");
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
  
    const [sourceRowIndexStr, sourceZone] = result.source.droppableId.split("-");
    const [destRowIndexStr, destZone] = result.destination.droppableId.split("-");
  
    const sourceRowIndex = parseInt(sourceRowIndexStr);
    const destRowIndex = parseInt(destRowIndexStr);
  
    const sourceZoneKey = sourceZone as "left" | "right";
    const destZoneKey = destZone as "left" | "right";
  
    const updatedRows = [...layoutRows];
  
    // Palette ➝ Layout drop
    if (result.source.droppableId === "palette") {
      if (
        isNaN(destRowIndex) ||
        !["left", "right"].includes(destZoneKey) ||
        !updatedRows[destRowIndex]
      ) {
        console.warn("Invalid palette drop destination", result);
        return;
      }
    
      const componentFromPalette = availableComponents[result.source.index];
    
      // Count how many photos exist to assign unique indices
      const allUsedPhotoIndices = updatedRows
        .flatMap((row) => ["left", "right"].flatMap((zone) =>
          row[zone as "left" | "right"].items
            .map((item) => item.photoIndex)
            .filter((i) => typeof i === "number")
        )) as number[];
    
      const nextAvailablePhotoIndex = Math.max(-1, ...allUsedPhotoIndices) + 1;
    
      const newComponent: SectionComponent = {
        id: uuidv4(),
        type: componentFromPalette.type,
        ...(componentFromPalette.type === "text" && {
          textType: undefined,
          value: "",
        }),
        ...(["photo", "profile-picture", "background-photo"].includes(componentFromPalette.type) && {
          photoIndex: nextAvailablePhotoIndex,
        }),
      };
    
      const destItems = [...updatedRows[destRowIndex][destZoneKey].items];
      destItems.splice(result.destination.index, 0, newComponent);
    
      updatedRows[destRowIndex][destZoneKey].items = destItems;
      setLayoutRows(updatedRows);

      if (componentFromPalette.type === "text") {
        const selectTextType = async () => {
          const anchor = document.querySelector(`[data-id="${newComponent.id}"]`);
          const textType = await showTextTypeDropdown(anchor as HTMLElement);
          if (textType === "new") {
            const maxIndex = Math.max(
              -1,
              ...layoutRows.flatMap(row =>
                [...row.left.items, ...row.right.items]
                  .filter(item => item.type === "text" && (item as TextComponent).textIndex !== undefined)
                  .map(item => (item as TextComponent).textIndex ?? 0)
              )
            );
            
            updateComponentTextType(newComponent.id, "new", maxIndex + 1);
          } else {
            updateComponentTextType(newComponent.id, textType);
          }
        };
        selectTextType();
      }
      return;
    }
  
    // Validate regular zone drops
    if (
      isNaN(sourceRowIndex) || isNaN(destRowIndex) ||
      !["left", "right"].includes(sourceZoneKey) ||
      !["left", "right"].includes(destZoneKey) ||
      !updatedRows[sourceRowIndex] ||
      !updatedRows[destRowIndex]
    ) {
      console.warn("Invalid layout drag result", result);
      return;
    }
  
    // Same zone move
    if (sourceRowIndex === destRowIndex && sourceZoneKey === destZoneKey) {
      const items = [...updatedRows[sourceRowIndex][sourceZoneKey].items];
      const [moved] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, moved);
  
      updatedRows[sourceRowIndex][sourceZoneKey].items = items;
      setLayoutRows(updatedRows);
      return;
    }
  
    // Cross-zone move
    const sourceItems = [...updatedRows[sourceRowIndex][sourceZoneKey].items];
    const destItems = [...updatedRows[destRowIndex][destZoneKey].items];
  
    const [moved] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, moved);
  
    updatedRows[sourceRowIndex][sourceZoneKey].items = sourceItems;
    updatedRows[destRowIndex][destZoneKey].items = destItems;
  
    setLayoutRows(updatedRows);
  };  

  const showTextTypeDropdown = (anchorEl?: HTMLElement) => {
    return new Promise<TextComponentType>((resolve) => {
      const dropdown = document.createElement("select");
      dropdown.className = "absolute z-50 bg-white border rounded shadow text-sm px-2 py-1";
      
      const options = [
        { value: "companyDescription", label: "Company Description" },
        { value: "ownerDescription", label: "Owner Description" },
        { value: "contact", label: "Contact" },
        { value: "new", label: "New Text" },
      ];
  
      options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.label;
        dropdown.appendChild(opt);
      });
  
      dropdown.onchange = () => {
        document.body.removeChild(dropdown);
        resolve(dropdown.value as TextComponentType);
      };
  
      document.body.appendChild(dropdown);
  
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        dropdown.style.position = "absolute";
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;
      }
    });
  };

  const updateComponentTextType = (componentId: string, textType: TextComponentType, textIndex?: number) => {
    setLayoutRows(prev => {
      const newRows = [...prev];
      for (const row of newRows) {
        for (const side of ["left", "right"] as const) {
          const item = row[side].items.find(i => i.id === componentId);
          if (item && item.type === "text") {
            const textItem = item as TextComponent;
            textItem.textType = textType;
            if (textIndex !== undefined) {
              textItem.textIndex = textIndex;
            }
            break;
          }
        }
      }
      return newRows;
    });
  };

  const renderComponent = (component: SectionComponent) => {
    switch (component.type) {
      case "photo":
        const photoIndex = component.photoIndex ?? 0;
        return businessData.photos?.[photoIndex] ? (
          <div
            className="relative border shadow w-[150px] h-36 rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${businessData.photos[photoIndex]})` }}
          >
            <Button
              variant="secondary"
              className="absolute top-1 right-1 p-1 w-6 h-6 rounded-full flex items-center justify-center"
              onClick={() => handleImageUpload(photoIndex)}
            >
              <Plus />
            </Button>
          </div>
        ) : (
          <Button onClick={() => handleImageUpload(photoIndex)}>
            <Plus /> Add Image
          </Button>
        );
  
      case "text":
        const textComp = component as TextComponent;
        return (
          <TextComponentRenderer
            component={textComp}
            businessData={businessData}
            updateComponentText={(id, newText) => {
              const updatedRows = [...layoutRows];
              for (const row of updatedRows) {
                for (const side of ["left", "right"] as const) {
                  const index = row[side].items.findIndex(i => i.id === id);
                  if (index !== -1) {
                    row[side].items[index].value = newText;
                    break;
                  }
                }
              }
              setLayoutRows(updatedRows);
            }}
            handleUpdateField={handleUpdateField}
          />
        );
  
      case "contact":
        return (
          <div className="flex gap-2 items-center">
            <p className="font-medium">Contact:</p>
            <Input
              type="text"
              value={businessData.phoneNumber}
              onChange={(e) => handleUpdateField("phoneNumber", e.target.value)}
              className="w-48"
            />
          </div>
        );
  
      case "packages":
        return (
          <div className="bg-white shadow p-4 rounded-md">
            <DataTableDemo packages={tableData} onSelectPackage={setSelectedPackage} />
            <AddPackage addPackage={(pkg) => setTableData((prev) => [...prev, pkg])} />
          </div>
        );
  
      default:
        return null;
    }
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
            {layoutRows.map((row, rowIndex) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {["left", "right"].map((zoneKey) => {
                  const zone = row[zoneKey as "left" | "right"];
                  return (
                    <div key={zoneKey} className={`flex ${zone.layout === "horizontal" ? "flex-row" : "flex-col"} gap-4`}>
                      {zone.items.map((item) => (
                        <div key={item.id}>{renderComponent(item)}</div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
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