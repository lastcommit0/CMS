export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'ADMIN' | 'SUB_ADMIN' | 'EDITOR';
  status?: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  managerId?: string;
}

export interface UpdateProfileData {
  designation?: string;
  jobType?: string;
  location?: string;
  bio?: string;
  avatar?: string;
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
  basicInfo: BasicUserInfo
  professionalInfo: ProfessionalUserInfo
}



export interface BasicUserInfo {
  firstName: string
  lastName: string
  email: string
  whatsAppNo: string
  password: string
  location?: string
  profileSummary: string
  avatar?: string
}


export interface ProfessionalUserInfo {
  role: UserRole
  designation: Designation
  jobType: JobType
  status: UserStatus
  managerId?: string
}



export const UserRole = {
  ADMIN : "ADMIN",
  SUB_ADMIN : "SUB_ADMIN",
  EDITOR : "EDITOR",
}as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const Designation = {
  EDITOR_IN_CHIEF : "EDITOR_IN_CHIEF",
  MANAGING_EDITOR : "MANAGING_EDITOR",
  EDITOR : "EDITOR",
  WRITER : "WRITER",
  CONTRIBUTOR : "CONTRIBUTOR",
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

