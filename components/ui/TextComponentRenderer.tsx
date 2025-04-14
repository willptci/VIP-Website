import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TextComponentType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface Props {
    component: {
      id: string;
      textType?: TextComponentType;
      textIndex?: number;
      value?: string;
      showDropdown?: boolean;
    };
    businessData: any;
    updateComponentText: (id: string, newText: string) => void;
    handleUpdateField: (field: string, value: string) => void;
}

const TextComponentRenderer: React.FC<Props> = ({
    component,
    businessData,
    updateComponentText,
    handleUpdateField,
  }) => {
    const [isEditing, setIsEditing] = useState(component.textType === "new");
  
    const displayText =
        component.textType === "companyDescription"
            ? businessData.companyDescription
            : component.textType === "ownerDescription"
            ? businessData.ownerDescription
            : component.textType === "contact"
            ? businessData.phoneNumber
            : component.textType === "new" && typeof component.textIndex === "number"
            ? businessData.customText?.[component.textIndex] || ""
            : component.value || "";

    if (component.showDropdown) {
      return (
        <div className="w-full">
          <Select
            onValueChange={(value: TextComponentType) => {
              const nextTextIndex =
                value === "new"
                  ? Math.max(0, (businessData?.customText?.length ?? 0)) // or from props
                  : undefined;
  
              // Update layout state via context or callback (you may need to lift state)
              const event = new CustomEvent("set-text-type", {
                detail: {
                  componentId: component.id,
                  textType: value,
                  textIndex: nextTextIndex,
                },
              });
              window.dispatchEvent(event);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select text type..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="companyDescription">Company Description</SelectItem>
              <SelectItem value="ownerDescription">Owner Description</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="new">Custom Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
  
    return isEditing ? (
        <Textarea
          value={displayText}
          onChange={(e) => {
            updateComponentText(component.id, e.target.value);
            if (component.textType === "new" && typeof component.textIndex === "number") {
              const updatedCustomText = [...(businessData.customText ?? [])];
              updatedCustomText[component.textIndex] = e.target.value;
              handleUpdateField("customText", JSON.stringify(updatedCustomText));
            } else if (component.textType && component.textType !== "new") {
              handleUpdateField(component.textType, e.target.value);
            }
          }}
          placeholder="Click to write something..."
          onBlur={() => {
            if (component.textType !== "new") setIsEditing(false);
          }}
          className="w-full h-28 rounded-md border bg-white px-3 py-2 text-sm"
        />
      ) : (
        <p
          className="cursor-pointer p-2 border rounded bg-muted/20"
          onClick={() => setIsEditing(true)}
        >
          {displayText || "Click to edit"}
        </p>
      )
  };
  
  export default TextComponentRenderer;