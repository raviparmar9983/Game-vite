import { api } from "@/lib";
import { type CreateRoomFormInputs } from "@/types";

export const createRoom = async (data: CreateRoomFormInputs) => {
  const response = await api.post("game", data);
  return response.data;
};

export const getGameById = async (gameId: string) => {
  const response = await api.get(`/game/${gameId}`);
  return response.data; // contains {status, message, data}
};

export const joinGameRoom = async (code: string) => {
  const response = await api.post(`game/join/${code}`);
  return response.data;
};

export const gameResult = async (gameId: string) => {
  const response = await api.get(`game/${gameId}/result`);
  return response.data;
};

export const createBotRoom = async (data: CreateRoomFormInputs) => {
  const response = await api.post("bot", data);
  return response.data;
};
