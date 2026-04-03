import { api } from "@/lib";

export const getUserProfile = async () => {
  const response = await api.get("/auth/user");
  return response.data;
};
