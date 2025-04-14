"use client";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import Row from "./CustomizeRow";
import { RowData } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "./button";

interface CustomizeCardProps {
  rows: RowData[];
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
}

const CustomizeCard: React.FC<CustomizeCardProps> = ({ rows, setRows }) => {
  const addRow = () => {
    const newRow: RowData = {
      id: uuidv4(),
      left: { layout: "vertical", items: [] },
      right: { layout: "vertical", items: [] },
    };
    setRows((prev) => [...prev, newRow]);
  };

  const removeItem = (rowIndex: number, zoneKey: "left" | "right", itemId: string) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const zone = updatedRows[rowIndex][zoneKey];
      zone.items = zone.items.filter((item) => item.id !== itemId);
      return updatedRows;
    });
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Customize</CardTitle>
            <CardDescription>
              Drag and drop components.
            </CardDescription>
          </div>
          <Button onClick={addRow} className="text-sm mt-2 bg-custom-9">
            + Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <Row
              key={row.id}
              row={row}
              rowIndex={rowIndex}
              setRows={setRows}
              removeItem={removeItem}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizeCard;