import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TextComponentType } from "@/types";

interface Props {
  component: {
    id: string;
    textType?: TextComponentType;
    textIndex?: number;
    value?: string;
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
      : component.value || "";

  return isEditing ? (
    <Textarea
      value={displayText}
      onChange={(e) => {
        updateComponentText(component.id, e.target.value);
        if (component.textType && component.textType !== "new") {
          handleUpdateField(component.textType, e.target.value);
        }
      }}
      onBlur={() => {
        if (component.textType !== "new") setIsEditing(false);
      }}
      placeholder={`Enter ${component.textType || "description"}...`}
      className="w-full h-28 rounded-md border bg-white px-3 py-2 text-sm"
    />
  ) : (
    <p
      className="cursor-pointer p-2 border rounded bg-muted/20"
      onClick={() => setIsEditing(true)}
    >
      {displayText || "Click to edit"}
    </p>
  );
};

export default TextComponentRenderer;