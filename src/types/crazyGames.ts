export interface CrazyGamesUser {
  userId: string;
  username: string;
  profilePictureUrl?: string;
}

export type CrazyGamesEnvironment = "crazygames" | "local" | "disabled" | "mock";

export interface CrazyGamesSdkError {
  code?: string;
  message?: string;
}

export interface CrazyGamesSdk {
  init?: () => Promise<void>;
  environment?: Exclude<CrazyGamesEnvironment, "mock">;
  getEnvironment?: () => Promise<Exclude<CrazyGamesEnvironment, "mock">>;
  user: {
    getUser: () => Promise<CrazyGamesUser | null>;
    showAuthPrompt: () => Promise<CrazyGamesUser>;
    getUserToken: () => Promise<string>;
    addAuthListener?: (listener: (user: CrazyGamesUser) => void) => void;
    removeAuthListener?: (listener: (user: CrazyGamesUser) => void) => void;
  };
}

export interface BackendAuthUser {
  _id?: string;
  id?: string;
  userName?: string;
  username?: string;
  email?: string;
  coins?: number;
  rewardedToday?: boolean;
  rewardCoins?: number;
  loginStreak?: number;
}

export interface BackendAuthResponse {
  status?: boolean;
  message?: string;
  data?: {
    user?: BackendAuthUser;
    accessToken?: string;
    refreshToken?: string;
    jwt?: string;
    token?: string;
  } & Record<string, unknown>;
  user?: BackendAuthUser;
  accessToken?: string;
  refreshToken?: string;
  jwt?: string;
  token?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    CrazyGames?: {
      SDK?: CrazyGamesSdk;
    };
  }
}

export {};
