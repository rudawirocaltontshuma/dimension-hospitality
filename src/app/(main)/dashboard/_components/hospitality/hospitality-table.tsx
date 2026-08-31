"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface HospitalityTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface HospitalityTableProps<T> {
  columns: HospitalityTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  pageSize?: number;
}

/**
 * A lightweight, presentational table shell shared across the Nexora Hospitality directories
 * (Reservations, Guests, Rooms, Staff, Maintenance, ...). Pages own search/filter/sort state
 * and pass in the already-derived `rows`; this component only paginates and renders them.
 */
export function HospitalityTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = "No results found.",
  pageSize = 10,
}: HospitalityTableProps<T>) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const pageCount = Math.max(Math.ceil(rows.length / pageSize), 1);
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const pageRows = rows.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.id} className={cn("whitespace-nowrap py-3 font-normal", column.headerClassName)}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  className={cn("border-border/60", onRowClick && "cursor-pointer hover:bg-muted/50")}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} className={cn("py-3 align-middle", column.cellClassName)}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {rows.length > pageSize ? (
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="text-muted-foreground text-sm tabular-nums">
            Page {currentPage + 1} of {pageCount} &middot; {rows.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setPageIndex((page) => Math.max(page - 1, 0))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPageIndex((page) => Math.min(page + 1, pageCount - 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
