// client/src/types/authTypes.ts
export interface LoginCredentials {
  identifier: string;
  password: string;
  captcha?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'ADMIN' | 'SUB_ADMIN' | 'EDITOR';
  designation: 'OPERATIONS_MANAGER' | 'COMMUNITY_MODERATOR' | 'COMPLIANCE_OFFICER' | 'EDITOR_IN_CHIEF' | 'MANAGING_EDITOR' | 'SENIOR_EDITOR' | 'COPY_EDITOR' | 'SEO_EDITOR';
  jobType: 'FULL_TIME' | 'PART_TIME' | 'FREELANCE' | 'INTERN';
  location?: string;
  bio: string;
  managerId?: string;
  avatar?: string;
}

export interface Identify {
  userId: string;
  username: string;
  requireCaptcha: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  roles: Array<{
    role: {
      name: 'ADMIN' | 'SUB_ADMIN' | 'EDITOR';
    };
  }>;
  profile?: {
    designation: string;
    jobType: string;
    location?: string;
    bio?: string;
    avatar?: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}