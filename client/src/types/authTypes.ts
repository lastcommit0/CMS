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
  role: '' | 'ADMIN' | 'SUB_ADMIN' | 'EDITOR';
  designation: '' | 'EDITOR_IN_CHIEF' | 'MANAGING_EDITOR' | 'EDITOR' | 'WRITER' | 'CONTRIBUTOR';
  jobType: '' | 'FULL_TIME' | 'PART_TIME' | 'FREELANCE' | 'INTERN';
  reportingManager: string;
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

export interface AuthResponse {
  user: RegisterData;
  accessToken: string;
  refreshToken: string;
}