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
  designation: 'EDITOR_IN_CHIEF' | 'MANAGING_EDITOR' | 'EDITOR' | 'WRITER' | 'CONTRIBUTOR';
  jobType: 'FULL_TIME' | 'PART_TIME' | 'FREELANCE' | 'INTERN';
  location?: string;
  bio: string;
}

export interface Identify {
  userId: string
  username: string
  requireCaptcha: boolean
}

export interface UserProfile {
  id: string;
  designation: string;
  jobType: string;
  location?: string;
  bio?: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}