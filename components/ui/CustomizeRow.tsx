import React from "react";
import { RowData } from "@/types";
import Zone from "./CustomizeZone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

interface RowProps {
  row: RowData;
  rowIndex: number;
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  removeItem: (rowIndex: number, zoneKey: "left" | "right", itemId: string) => void;
}

const Row: React.FC<RowProps> = ({ row, rowIndex, setRows, removeItem }) => {
  const toggleLayout = (side: "left" | "right") => {
    setRows((prevRows) =>
      prevRows.map((r, i) =>
        i === rowIndex
          ? {
              ...r,
              [side]: {
                ...r[side],
                layout: r[side].layout === "vertical" ? "horizontal" : "vertical",
              },
            }
          : r
      )
    );
  };

  const deleteRow = () => {
    setRows((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  return (
    <div className="flex flex-col gap-4 border p-6 rounded-xl bg-white">

      <div className="flex flex-col md:flex-row gap-6 items-start justify-center">
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="flex justify-between items-center w-full mb-4">
            <span className="text-sm font-medium">Left Zone</span>
            <Button
              onClick={() => toggleLayout("left")}
              className="text-xs p-2 rounded-full bg-custom-9"
            >
              {row.left.layout}
            </Button>
          </div>
          <div className="bg-gray-200 min-w-16 rounded-lg">
            <Zone
                droppableId={`${rowIndex}-left`}
                zone={row.left}
                rowIndex={rowIndex}
                zoneKey="left"
                removeItem={removeItem}
            />
          </div>
        </div>

        <Separator orientation="vertical" className="self-stretch min-h-[120px] bg-custom-8" />

        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="flex justify-between items-center w-full mb-4">
            <span className="text-sm font-medium">Right Zone</span>
            <Button
              onClick={() => toggleLayout("right")}
              className="text-xs rounded-full bg-custom-9"
            >
              {row.right.layout}
            </Button>
          </div>
          <div className="bg-gray-200 min-w-16 rounded-lg">
            <Zone
                droppableId={`${rowIndex}-right`}
                zone={row.right}
                rowIndex={rowIndex}
                zoneKey="right"
                removeItem={removeItem}
            />
          </div>
        </div>
        <button
            onClick={deleteRow}
            className="relative top-0 right-0 text-gray-400 hover:text-red-700"
            title="Delete Row"
        >
            <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Row;