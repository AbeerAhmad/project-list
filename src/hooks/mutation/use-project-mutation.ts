import { Project } from "@/types/project";
import { delay } from "@/util";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type CreateProjectInput = Omit<Project, "id" | "isFavorite">;

const createProject = async (input: CreateProjectInput): Promise<Project> => {
  // Simulate API delay
  await delay(1000);
  // Get existing projects from localStorage or use empty array
  const storedProjects = localStorage.getItem("projects");
  const existingProjects: Project[] = storedProjects
    ? JSON.parse(storedProjects)
    : [];
  // Create new project with generated ID and default isFavorite
  const newProject: Project = {
    ...input,
    id: crypto.randomUUID(),
    isFavorite: false,
  };
  // Add to existing projects
  const updatedProjects = [...existingProjects, newProject];
  // Save back to localStorage
  localStorage.setItem("projects", JSON.stringify(updatedProjects));

  return newProject;
};

const updateProject = async (
  project: Partial<Project> & { id: string }
): Promise<Project> => {
  await delay(1000);
  const storedProjects = localStorage.getItem("projects");
  const existingProjects: Project[] = storedProjects
    ? JSON.parse(storedProjects)
    : [];
  const updatedProjects = existingProjects.map((p) =>
    p.id === project.id ? { ...p, ...project } : p
  );
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  return updatedProjects.find((p) => p.id === project.id)!;
};

const deleteProject = async (id: string): Promise<void> => {
  await delay(1000);
  const storedProjects = localStorage.getItem("projects");
  const existingProjects: Project[] = storedProjects
    ? JSON.parse(storedProjects)
    : [];
  const filteredProjects = existingProjects.filter((p) => p.id !== id);
  localStorage.setItem("projects", JSON.stringify(filteredProjects));
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const queryKey: QueryFilters = {
    queryKey: ["projects"],
    type: "active",
  };
  return useMutation({
    mutationFn: updateProject,
    onMutate: async (newProject) => {
      if ("isFavorite" in newProject) {
        await queryClient.cancelQueries({ queryKey: ["projects"] });
        const prevKeyData = queryClient.getQueriesData(queryKey);
        const previousProjects = prevKeyData?.[0]?.[1] as Project[];
        const updatedProjects = previousProjects.map((p) =>
          p.id === newProject.id ? { ...p, ...newProject } : p
        );
        queryClient.setQueriesData(queryKey, updatedProjects);
        if (newProject.id) {
          queryClient.setQueryData(
            ["project", newProject.id],
            updatedProjects?.find((p) => p.id === newProject.id)
          );
        }
        return { previousProjects, updatedProjects };
      }
    },
    onError: (err, newProject, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(["projects"], context.previousProjects);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
