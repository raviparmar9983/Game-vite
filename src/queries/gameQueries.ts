import { createBotRoom, createRoom, gameResult, getGameById, joinGameRoom } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateRoom = () => {
  return useMutation({ mutationFn: createRoom });
};

export const useGame = (gameId: string) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGameById(gameId),
    enabled: !!gameId, // only fetch when gameId exists
  });
};

export const useJoinGameRoom = () => {
  return useMutation({ mutationFn: joinGameRoom });
};

export const useGameResult = (gameId: string) => {
  return useQuery({
    queryKey: ["gameResult", gameId],
    queryFn: () => gameResult(gameId),
    enabled: !!gameId,
  });
};


export const useCreateBotRoom = () => {
  return useMutation({ mutationFn: createBotRoom });
}