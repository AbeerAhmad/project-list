"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
  Pagination,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface DataTableProps<TData> {
  columns: { id: string; label: string }[];
  data: TData[];
  page: number;
  limit?: number;
  total?: number;
  isLoading?: boolean;
  noDataText?: string;
  hidePagination?: boolean;
  onPageChange?: (page: number) => void;
  baseClass?: string;
}

export function DataTable<TData>({
  columns,
  data,
  page = 1,
  total,
  isLoading,
  noDataText = "No results.",
  hidePagination = false,
  onPageChange,
  baseClass,
}: DataTableProps<TData>) {
  const tableData = isLoading ? Array(10).fill({}) : data;
  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          maxWidth: "100%",
          overflowX: "auto",
          mt: "30px",
          bgcolor: "white",
          borderRadius: "10px",
        }}
        className={baseClass}
      >
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    textAlign: "left",
                    textWrap: "nowrap",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    padding: "16px",
                    color: "#333",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              Array(10)
                .fill({})
                .map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          padding: "16px",
                          fontSize: "0.875rem",
                          color: "#333",
                        }}
                      >
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={36}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : tableData.length > 0 ? (
              tableData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => router.push(`/projects/details/${row.id}`)}
                  sx={{
                    "& td, & th": {
                      borderBottom: "1px solid #ddd",
                    },
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#f0f0f0",
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        padding: "16px",
                        fontSize: "0.875rem",
                        color: "#333",
                        textWrap: "nowrap",
                      }}
                    >
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    padding: "16px",
                    fontSize: "0.875rem",
                    color: "#333",
                    textWrap: "nowrap",
                  }}
                >
                  {noDataText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      {!hidePagination && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            count={total || 0}
            page={page - 1}
            onChange={(_, newPage) => onPageChange && onPageChange(newPage + 1)}
          />
        </Box>
      )}
    </>
  );
}
