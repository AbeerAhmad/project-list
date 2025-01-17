import { LIMIT } from "@/config/constant";
import { Project } from "@/types/project";
import { delay } from "@/util";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
type Props = {
  limit?: number;
  offset: number;
};

const getAllProjects = async ({ limit = LIMIT, offset }: Props) => {
  // Simulate API delay
  await delay(3000);
  // Get data from localStorage or use mock data if not present
  const storedProjects = localStorage.getItem("projects");
  const projects = storedProjects ? JSON.parse(storedProjects) : [];

  const start = offset;
  const end = start + limit;

  return projects.slice(start, end) as Project[];
};

const getProjectById = async (id: string) => {
  await delay(1000);
  const storedProjects = localStorage.getItem("projects");
  const projects = storedProjects ? JSON.parse(storedProjects) : [];
  return projects.find((project: Project) => project.id === id) as Project;
};

export const useGetAllProjects = (options: Props) => {
  const { offset } = options;
  return useQuery({
    queryKey: ["projects", offset],
    queryFn: () => getAllProjects(options),
    placeholderData: keepPreviousData,
    staleTime: 60 * 5000, // 5 mins
  });
};

export const useGetProjectById = (id?: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
    enabled: !!id,
    staleTime: 60 * 5000, // 5 mins
  });
};
