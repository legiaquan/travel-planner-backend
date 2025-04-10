export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  subscription: {
    plan: string;
    expiresAt: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserResponse;
}
