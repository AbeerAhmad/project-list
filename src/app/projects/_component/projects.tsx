"use client";

import { DataTable } from "@/components/data-table";
import { useGetAllProjects } from "@/hooks/query/use-project-query";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useUpdateProject } from "@/hooks/mutation/use-project-mutation";
import Loader from "@/components/loader";
import Link from "next/link";
const LIMIT = 10;

// Sample columns definition
const columns = [
  { id: "name", label: "Name" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "manager", label: "Project Manager" },
  { id: "actions", label: "Actions" },
];

const PaginatedTable = () => {
  const [page, setPage] = useState(1); // Start on page 1
  const { data, isLoading, isPending } = useGetAllProjects({
    offset: (page - 1) * LIMIT,
  });
  const projectList = data ?? [];

  const updateProject = useUpdateProject();

  const tableData = projectList.map((item) => ({
    id: item.id,
    name: item.name,
    startDate: item.startDate.toString().slice(0, 10),
    endDate: item.endDate.toString().slice(0, 10),
    manager: item.manager,
    isFavorite: item.isFavorite,
    actions: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            updateProject.mutate({
              id: item.id,
              isFavorite: !item.isFavorite,
            });
          }}
        >
          {item.isFavorite ? <StarRateIcon /> : <StarOutlineIcon />}
        </Button>
        <Button
          component={Link}
          href={`/projects/edit/${item.id}`}
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Edit
        </Button>
      </Box>
    ),
  }));

  // Function to handle page changes
  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
  };

  if (isPending && (!data || projectList?.length === 0)) {
    return <Loader />;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/projects/new"
        >
          Create Project
        </Button>
      </Box>
      <DataTable
        columns={columns}
        data={tableData}
        page={page}
        total={data?.length ?? 0}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        noDataText="No data available."
        // paginator is not working correctly thats why i have hidden it
        hidePagination={true}
      />
    </>
  );
};

export default PaginatedTable;
