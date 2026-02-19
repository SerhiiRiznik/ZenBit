import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";
import { AuthAction } from "./typing/auth.enum";
import { LoginPayload, RegisterPayload } from "./typing/auth.interface";

const extractBackendErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallback;
};

export const login = createAsyncThunk(
  AuthAction.LOGIN,
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", payload);
      return response.data as { accessToken: string };
    } catch (error) {
      return rejectWithValue(
        extractBackendErrorMessage(error, "Invalid email or password."),
      );
    }
  },
);

export const registration = createAsyncThunk(
  AuthAction.REGISTRATION,
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", payload);
      return response.data as { accessToken: string };
    } catch (error) {
      return rejectWithValue(
        extractBackendErrorMessage(
          error,
          "Cannot register now. Please try again.",
        ),
      );
    }
  },
);

export const logout = createAsyncThunk(
  AuthAction.LOGOUT,
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(
        extractBackendErrorMessage(
          error,
          "Cannot log out now. Please try again.",
        ),
      );
    }
  },
);
