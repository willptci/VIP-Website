"use client";
import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Grip } from "lucide-react";
import { SectionComponent } from "@/types";

interface ComponentPaletteProps {
  components: SectionComponent[];
}

const renderLabel = (type: string) => {
  return type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ components }) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Components</h3>
      <Droppable droppableId="palette" isDropDisabled={true}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-wrap gap-3 p-3 bg-muted/20 rounded-md"
          >
            {components.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="flex items-center border rounded px-2 py-1 bg-white shadow text-sm"
                  >
                    <div {...provided.dragHandleProps} className="cursor-grab mr-2">
                      <Grip className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {renderLabel(item.type)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ComponentPalette;