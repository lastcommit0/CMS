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