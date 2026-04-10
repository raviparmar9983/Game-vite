import { api } from "@/lib";
import { environment } from "@/lib/env";
import type { BackendAuthResponse, CrazyGamesUser } from "@/types/crazyGames";

export const exchangeCrazyGamesToken = async (payload: {
  token: string;
  user: CrazyGamesUser;
  isDevMode?: boolean;
}): Promise<BackendAuthResponse> => {
  const response = await api.post(environment.CRAZYGAMES_AUTH_URL, {
    token: payload.token,
    crazyGamesUser: payload.user,
    isDevMode: payload.isDevMode ?? false,
  });

  return response.data;
};
