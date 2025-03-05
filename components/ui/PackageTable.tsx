"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "@/types";
import TableDropDown from "./TableDropDown";

export const columns: ColumnDef<Package>[] = [
  {
    accessorKey: "title",
    header: "Package",
    cell: ({ row }) => <div className="text-lg font-semibold pl-3">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue<boolean>("status") ? "Available" : "Unavailable"}
      </div>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Max Capacity",
    cell: ({ row }) => <div>{row.getValue("capacity")}</div>,
  },
  {
    accessorKey: "total",
    header: "Time",
    cell: ({ row }) => <div>{row.getValue("total")}</div>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <div>5</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Amount
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "per",
    header: "Per",
    cell: ({ row }) => <div className="flex justiify-end">{row.getValue("per")}</div>,
  },
];

export function DataTableDemo({ packages, onSelectPackage }: { packages: Package[], onSelectPackage: (pkg: Package | null) => void }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);

  const handleRowSelectionAndExpansion = (rowId: string, rowData: Package) => {
    setSelectedRow((prev) => {
      const isSelected = prev === rowId; // Check if the current row is already selected
      onSelectPackage(isSelected ? null : rowData); // Pass the selected package or null
      return isSelected ? null : rowId; // Toggle selection
    });
  };

  const table = useReactTable({
    data: packages,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      // rowSelection,
    },
  });

  return (
    <div className="w-full text-custom-8 font-syne">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={
                      selectedRow === row.id && "selected"
                    } /* Highlight selected row */
                    onClick={() =>
                      handleRowSelectionAndExpansion(row.id, row.original)
                    }
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {selectedRow === row.id && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="bg-gray-50 p-4"
                      >
                        <div>
                          <TableDropDown packageData={row.original} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}