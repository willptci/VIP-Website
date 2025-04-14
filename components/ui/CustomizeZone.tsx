"use client";
import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Zone as ZoneType, SectionComponent } from "@/types";
import { Grip, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoneProps {
  droppableId: string;
  zone: ZoneType;
  rowIndex: number;
  zoneKey: "left" | "right";
  removeItem: (rowIndex: number, zoneKey: "left" | "right", itemId: string) => void;
}

const renderComponent = (component: SectionComponent) => {
  return (
    <div className="p-2 rounded bg-white text-sm w-full min-w-[100px]">
      {component.type.replace(/-/g, " ").toUpperCase()}
    </div>
  );
};

const Zone: React.FC<ZoneProps> = ({ droppableId, zone, rowIndex, zoneKey, removeItem }) => {
  return (
    <Droppable droppableId={droppableId} direction={zone.layout === "horizontal" ? "horizontal" : "vertical"}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "min-h-[60px] bg-muted/20 p-2 rounded flex gap-2",
            // zone.layout === "vertical" ? "flex-col" : "flex-row"
            "flex-col"
          )}
        >
          {zone.items.map((item, index) => (
            <Draggable draggableId={item.id} index={index} key={item.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className="flex items-center gap-2 border p-1.5 rounded bg-white relative"
                >
                  <div {...provided.dragHandleProps} className="cursor-grab">
                    <Grip className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {renderComponent(item)}
                  <button
                    onClick={() => removeItem(rowIndex, zoneKey, item.id)}
                    className="text-custom-8 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Zone;