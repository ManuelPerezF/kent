export interface PublicUser {
  id: number;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface RegisterBody {
  username: string;
  password: string;
}
