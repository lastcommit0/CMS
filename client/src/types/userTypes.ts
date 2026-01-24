export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
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


export interface UserFormState {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  location?: string
  bio: string
  role: UserRole | ''
  designation: Designation | ''
  jobType: JobType | ''
  managerId?: string
  avatar?: string
}


export const UserRole = {
  ADMIN : "ADMIN",
  SUB_ADMIN : "SUB_ADMIN",
  EDITOR : "EDITOR",
}as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

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
export type Designation = typeof Designation[keyof typeof Designation];


export const JobType = {
  FULL_TIME : "FULL_TIME",
  PART_TIME : "PART_TIME",
  FREELANCE : "FREELANCE",
  INTERN : "INTERN",
} as const;
export type JobType = typeof JobType[keyof typeof JobType];

export const UserStatus = {
  ACTIVE : "ACTIVE",
  SUSPENDED : "SUSPENDED",
  DEACTIVATED : "DEACTIVATED",
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

