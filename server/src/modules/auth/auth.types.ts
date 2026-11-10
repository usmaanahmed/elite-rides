// Auth module ke TypeScript types

export interface LoginInput {
  email: string;
  password: string;
}

// Login/me response me jo admin data frontend ko jata hai (passwordHash kabhi nahi)
export interface AuthenticatedAdmin {
  id: string;
  name: string;
  email: string;
}

export interface LoginResult {
  token: string;
  admin: AuthenticatedAdmin;
}
