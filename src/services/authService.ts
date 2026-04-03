import { api } from "@/lib";
import { type RegisterFormInputs } from "@/schemas";

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: RegisterFormInputs) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: { token: string; password: string }) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
