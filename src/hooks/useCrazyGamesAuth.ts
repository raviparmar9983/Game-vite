import { exchangeCrazyGamesToken } from "@/services";
import {
  clearBackendSession,
  extractBackendAccessToken,
  extractBackendUser,
  setBackendSession,
} from "@/lib/authSession";
import {
  addCrazyGamesAuthListener,
  canUseCrazyGamesSdk,
  getCrazyGamesEnvironment,
  getCrazyGamesErrorCode,
  getCrazyGamesUser,
  getCrazyGamesUserToken,
  isCrazyGamesSdkMocked,
  isCrazyGamesUserCancellation,
  removeCrazyGamesAuthListener,
  showCrazyGamesAuthPrompt,
} from "@/lib/crazyGames";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  BackendAuthResponse,
  BackendAuthUser,
  CrazyGamesEnvironment,
  CrazyGamesUser,
} from "@/types/crazyGames";

interface RefreshOptions {
  fetchToken?: boolean;
}

export interface CrazyGamesAuthState {
  sdkInitialized: boolean;
  environment: CrazyGamesEnvironment | null;
  isLoading: boolean;
  error: string | null;
  user: CrazyGamesUser | null;
  token: string | null;
  backendAuth: BackendAuthResponse | null;
  backendUser: BackendAuthUser | null;
  backendToken: string | null;
  isGuest: boolean;
  refreshAuth: (options?: RefreshOptions) => Promise<void>;
  signIn: () => Promise<void>;
  getFreshToken: () => Promise<string | null>;
}

interface MutableAuthState {
  sdkInitialized: boolean;
  environment: CrazyGamesEnvironment | null;
  isLoading: boolean;
  error: string | null;
  user: CrazyGamesUser | null;
  token: string | null;
  backendAuth: BackendAuthResponse | null;
}

const initialState: MutableAuthState = {
  sdkInitialized: false,
  environment: null,
  isLoading: true,
  error: null,
  user: null,
  token: null,
  backendAuth: null,
};

const getHumanErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const useCrazyGamesAuth = (): CrazyGamesAuthState => {
  const [state, setState] = useState<MutableAuthState>(initialState);

  const mountedRef = useRef(true);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  const updateState = useCallback((updater: Partial<MutableAuthState>) => {
    if (!mountedRef.current) {
      return;
    }

    setState((current) => ({ ...current, ...updater }));
  }, []);

  const syncBackendAuth = useCallback(
    async (user: CrazyGamesUser | null) => {
      if (!user) {
        clearBackendSession();
        updateState({
          user: null,
          token: null,
          backendAuth: null,
        });
        return null;
      }

      const freshToken = await getCrazyGamesUserToken();

      updateState({
        user,
        token: freshToken,
      });

      if (!freshToken) {
        clearBackendSession();
        updateState({ backendAuth: null });
        return null;
      }

      const backendAuth = await exchangeCrazyGamesToken({
        token: freshToken,
        user,
        isDevMode: isCrazyGamesSdkMocked(),
      });

      setBackendSession(backendAuth);
      updateState({ backendAuth });

      return freshToken;
    },
    [updateState],
  );

  const refreshAuth = useCallback(
    async ({ fetchToken = true }: RefreshOptions = {}) => {
      if (refreshPromiseRef.current) {
        return refreshPromiseRef.current;
      }

      const refreshPromise = (async () => {
        updateState({ isLoading: true, error: null });

        try {
          const environment = await getCrazyGamesEnvironment();
          const canUseSdk = await canUseCrazyGamesSdk();

          updateState({
            sdkInitialized: true,
            environment,
          });

          if (!canUseSdk && environment !== "mock") {
            clearBackendSession();
            updateState({
              isLoading: false,
              user: null,
              token: null,
              backendAuth: null,
            });
            return;
          }

          const sdkUser = await getCrazyGamesUser();

          if (!sdkUser) {
            clearBackendSession();
            updateState({
              user: null,
              token: null,
              backendAuth: null,
            });
            return;
          }

          updateState({ user: sdkUser });

          if (!fetchToken) {
            return;
          }

          try {
            await syncBackendAuth(sdkUser);
          } catch (error) {
            clearBackendSession();
            updateState({
              backendAuth: null,
              error: getHumanErrorMessage(
                error,
                "CrazyGames login succeeded, but backend verification failed.",
              ),
            });
          }
        } catch (error) {
          clearBackendSession();
          updateState({
            user: null,
            token: null,
            backendAuth: null,
            error: getHumanErrorMessage(error, "Failed to load CrazyGames authentication."),
          });
        } finally {
          updateState({ isLoading: false });
        }
      })();

      refreshPromiseRef.current = refreshPromise.finally(() => {
        refreshPromiseRef.current = null;
      });

      return refreshPromiseRef.current;
    },
    [syncBackendAuth, updateState],
  );

  const getFreshToken = useCallback(async () => {
    try {
      const freshToken = await getCrazyGamesUserToken();

      updateState({
        token: freshToken,
        error: null,
      });

      return freshToken;
    } catch (error) {
      if (getCrazyGamesErrorCode(error) === "userNotAuthenticated") {
        updateState({
          user: null,
          token: null,
          backendAuth: null,
          error: null,
        });
        clearBackendSession();
        return null;
      }

      updateState({
        error: getHumanErrorMessage(error, "Unable to refresh the CrazyGames token."),
      });
      throw error;
    }
  }, [updateState]);

  const signIn = useCallback(async () => {
    updateState({ isLoading: true, error: null });

    try {
      const environment = await getCrazyGamesEnvironment();
      const canUseSdk = await canUseCrazyGamesSdk();

      updateState({
        sdkInitialized: true,
        environment,
      });

      if (!canUseSdk && environment !== "mock") {
        updateState({ isLoading: false });
        return;
      }

      const promptUser = await showCrazyGamesAuthPrompt();
      const resolvedUser = promptUser ?? (await getCrazyGamesUser());

      if (!resolvedUser) {
        clearBackendSession();
        updateState({
          user: null,
          token: null,
          backendAuth: null,
        });
        return;
      }

      try {
        await syncBackendAuth(resolvedUser);
      } catch (error) {
        clearBackendSession();
        updateState({
          user: resolvedUser,
          backendAuth: null,
          error: getHumanErrorMessage(
            error,
            "CrazyGames login succeeded, but backend verification failed.",
          ),
        });
      }
    } catch (error) {
      if (isCrazyGamesUserCancellation(error)) {
        updateState({ error: null });
        return;
      }

      updateState({
        error: getHumanErrorMessage(error, "Unable to complete the CrazyGames sign-in flow."),
      });
    } finally {
      updateState({ isLoading: false });
    }
  }, [syncBackendAuth, updateState]);

  useEffect(() => {
    mountedRef.current = true;
    void refreshAuth();

    return () => {
      mountedRef.current = false;
    };
  }, [refreshAuth]);

  useEffect(() => {
    let isSubscribed = true;
    let listener: ((user: CrazyGamesUser) => void) | null = null;

    const attachListener = async () => {
      const environment = await getCrazyGamesEnvironment();
      const canUseSdk = await canUseCrazyGamesSdk();

      if (!isSubscribed || environment === "mock" || !canUseSdk) {
        return;
      }

      listener = (user) => {
        void syncBackendAuth(user).catch((error) => {
          clearBackendSession();
          updateState({
            user,
            backendAuth: null,
            error: getHumanErrorMessage(
              error,
              "CrazyGames login changed, but backend verification failed.",
            ),
          });
        });
      };

      addCrazyGamesAuthListener(listener);
    };

    void attachListener();

    return () => {
      isSubscribed = false;

      if (listener) {
        removeCrazyGamesAuthListener(listener);
      }
    };
  }, [syncBackendAuth, updateState]);

  const backendUser = extractBackendUser(state.backendAuth);
  const backendToken = extractBackendAccessToken(state.backendAuth);

  return {
    sdkInitialized: state.sdkInitialized,
    environment: state.environment,
    isLoading: state.isLoading,
    error: state.error,
    user: state.user,
    token: state.token,
    backendAuth: state.backendAuth,
    backendUser,
    backendToken,
    isGuest: !state.user,
    refreshAuth,
    signIn,
    getFreshToken,
  };
};
