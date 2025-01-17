"use client";

import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  useCreateProject,
  useUpdateProject,
} from "@/hooks/mutation/use-project-mutation";
import { Project } from "@/types/project";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetProjectById } from "@/hooks/query/use-project-query";
import Loader from "../loader";
import Link from "next/link";

interface ProjectFormProps {
  projectId?: string;
  isEdit?: boolean;
  isDetails?: boolean;
}

const defaultValues: Omit<Project, "id"> = {
  name: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false,
  manager: "",
};

export default function CreateEditProject({
  projectId,
  isEdit = false,
  isDetails = false,
}: ProjectFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Project>({
    defaultValues,
  });

  const router = useRouter();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: projectData, isLoading: isLoadingProject } =
    useGetProjectById(projectId);

  const onSubmit = async (data: Project) => {
    if (isEdit && projectData?.id) {
      updateProject.mutate(
        {
          ...data,
          id: projectData.id,
        },
        {
          onSuccess: () => {
            toast.success("Project updated successfully");
            router.push("/projects");
          },
          onError: () => {
            toast.error("Error updating project");
          },
        }
      );
    } else {
      createProject.mutate(data, {
        onSuccess: () => {
          toast.success("Project created successfully");
          router.push("/projects");
        },
        onError: () => {
          toast.error("Error creating project");
        },
      });
    }
  };

  useEffect(() => {
    reset(
      (isEdit || isDetails) && projectId && projectData
        ? projectData
        : defaultValues
    );
  }, [isEdit, isDetails, projectId, projectData, reset]);

  const loading = createProject.isPending || updateProject.isPending;

  if ((isEdit || isDetails) && isLoadingProject) {
    return <Loader />;
  }

  const getFormTitle = () => {
    if (isEdit) return "Edit Project";
    if (isDetails) return "Project Details";
    return "Create New Project";
  };

  const renderDatePicker = (name: "startDate" | "endDate", label: string) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required` }}
      render={({ field }) => (
        <DatePicker
          {...field}
          label={label}
          value={dayjs(field.value)}
          onChange={(date) => field.onChange(date)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors[name],
              helperText: errors[name]?.message,
              disabled: isDetails,
            },
          }}
        />
      )}
    />
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          {getFormTitle()}
        </Typography>
        {isDetails && projectData?.id && (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              updateProject.mutate({
                id: projectData?.id,
                isFavorite: !projectData?.isFavorite,
              });
            }}
          >
            {projectData?.isFavorite ? (
              <StarRateIcon sx={{ fontSize: "2rem" }} />
            ) : (
              <StarOutlineIcon sx={{ fontSize: "2rem" }} />
            )}
          </Button>
        )}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3, maxWidth: "600px" }}
      >
        {isEdit && isDetails && (
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                disabled
                label="Project ID"
                margin="normal"
              />
            )}
          />
        )}

        <Controller
          name="name"
          control={control}
          rules={{ required: "Project name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Project Name"
              error={!!errors.name}
              disabled={isDetails}
              helperText={errors.name?.message}
              margin="normal"
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Description"
              error={!!errors.description}
              disabled={isDetails}
              helperText={errors.description?.message}
              margin="normal"
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            maxWidth: "450px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {renderDatePicker("startDate", "Start Date")}
            {renderDatePicker("endDate", "End Date")}
          </LocalizationProvider>
        </Box>

        <Controller
          name="manager"
          control={control}
          rules={{ required: "Project manager is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Project Manager"
              error={!!errors.manager}
              helperText={errors.manager?.message}
              margin="normal"
              disabled={isDetails}
            />
          )}
        />

        <Box sx={{ mt: 3 }}>
          {isDetails ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="button"
                size="large"
                variant="outlined"
                color="info"
                component={Link}
                href="/projects"
              >
                Back
              </Button>
              <Button
                type="button"
                size="large"
                variant="contained"
                color="primary"
                component={Link}
                href={`/projects/edit/${projectId}`}
              >
                Edit
              </Button>
            </Box>
          ) : (
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              disabled={loading || isDetails}
              loading={loading}
            >
              {isEdit ? "Update" : "Create Project"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
