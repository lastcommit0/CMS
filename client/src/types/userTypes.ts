import { z } from "zod";
import { id } from "zod/v4/locales";

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserStats {
  storiesCount: number;
  publishedStoriesCount: number;
  draftStoriesCount: number;
  pollsCount: number;
  activePollsCount: number;
  reportsCount: number;
  recentStories: any[];
}


export const UserRole = {
  ADMIN : "ADMIN",
  SUB_ADMIN : "SUB_ADMIN",
  EDITOR : "EDITOR",
}as const;
export const userRoleSchema = z.nativeEnum(UserRole);
export type UserRole = z.infer<typeof userRoleSchema>;
export const USER_ROLES = Object.values(UserRole);


export const Designation = {
  OPERATIONS_MANAGER: "OPERATIONS_MANAGER",
  COMMUNITY_MODERATOR: "COMMUNITY_MODERATOR",
  COMPLIANCE_OFFICER: "COMPLIANCE_OFFICER",
  EDITOR_IN_CHIEF: "EDITOR_IN_CHIEF",
  MANAGING_EDITOR: "MANAGING_EDITOR",
  SENIOR_EDITOR: "SENIOR_EDITOR",
  COPY_EDITOR: "COPY_EDITOR",
  SEO_EDITOR: "SEO_EDITOR",
} as const;
export const designationSchema = z.nativeEnum(Designation);
export type Designation = z.infer<typeof designationSchema>;
export const DESIGNATIONS = Object.values(Designation);


export const JobType = {
  FULL_TIME : "FULL_TIME",
  PART_TIME : "PART_TIME",
  FREELANCE : "FREELANCE",
  INTERN : "INTERN",
} as const;
export const jobTypeSchema = z.nativeEnum(JobType);
export type JobType = z.infer<typeof jobTypeSchema>;
export const JOB_TYPES = Object.values(JobType);


export const userFormSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().min(8).optional(),
  role: userRoleSchema,
  designation: designationSchema,
  jobType: jobTypeSchema,
  location: z.string().optional(),
  bio: z.string(),
  managerId: z.string().optional(),
  avatar: z.string().optional(),
});

export type UserFormState = z.infer<typeof userFormSchema>;


export const UserStatus = {
  ACTIVE : "ACTIVE",
  SUSPENDED : "SUSPENDED",
  DEACTIVATED : "DEACTIVATED",
} as const;
export const userStatusSchema = z.nativeEnum(UserStatus);
export type UserStatus = z.infer<typeof userStatusSchema>;
