import type { BackendAuthResponse, BackendAuthUser } from "@/types/crazyGames";

let accessTokenCache: string | null = null;
let refreshTokenCache: string | null = null;

export const extractBackendAccessToken = (payload: BackendAuthResponse | null | undefined) => {
  if (!payload) {
    return null;
  }

  return (
    payload.accessToken ??
    payload.jwt ??
    payload.token ??
    payload.data?.accessToken ??
    payload.data?.jwt ??
    payload.data?.token ??
    null
  );
};

export const extractBackendRefreshToken = (payload: BackendAuthResponse | null | undefined) => {
  if (!payload) {
    return null;
  }

  return payload.refreshToken ?? payload.data?.refreshToken ?? null;
};

export const extractBackendUser = (payload: BackendAuthResponse | null | undefined): BackendAuthUser | null => {
  if (!payload) {
    return null;
  }

  return payload.user ?? payload.data?.user ?? null;
};

export const setBackendSession = (payload: BackendAuthResponse | null | undefined) => {
  accessTokenCache = extractBackendAccessToken(payload);
  refreshTokenCache = extractBackendRefreshToken(payload);
};

export const clearBackendSession = () => {
  accessTokenCache = null;
  refreshTokenCache = null;
};

export const getBackendAccessToken = () => accessTokenCache;

export const getBackendRefreshToken = () => refreshTokenCache;
