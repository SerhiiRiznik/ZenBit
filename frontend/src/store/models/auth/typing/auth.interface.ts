export interface IAuth {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  token: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
