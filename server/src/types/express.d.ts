import "passport";

declare global {
  namespace Express {
    interface User {
      id: string;

      email?: string;
      role?: string[];
      permissions?: string[];

      emails?: { value: string }[];
      displayName?: string;
      photos?: { value: string }[];
      provider?: string;
    }
  }
}

export {};
