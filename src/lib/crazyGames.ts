import type {
  CrazyGamesEnvironment,
  CrazyGamesSdk,
  CrazyGamesSdkError,
  CrazyGamesUser,
} from "@/types/crazyGames";

const MOCK_USER: CrazyGamesUser = {
  userId: "dev-crazygames-user",
  username: "Dev Player",
  profilePictureUrl: "",
};

const MOCK_TOKEN = "dev-crazygames-token";

let initPromise: Promise<void> | null = null;
let environmentPromise: Promise<CrazyGamesEnvironment> | null = null;

const isBrowser = () => typeof window !== "undefined";

const getSdk = (): CrazyGamesSdk | null => {
  if (!isBrowser()) {
    return null;
  }

  return window.CrazyGames?.SDK ?? null;
};

export const isCrazyGamesSdkAvailable = () => !!getSdk();

export const isCrazyGamesSdkMocked = () => !isCrazyGamesSdkAvailable();

const ensureCrazyGamesSdkInitialized = async () => {
  if (isCrazyGamesSdkMocked()) {
    return;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const sdk = getSdk();

      if (!sdk) {
        return;
      }

      await sdk.init?.();
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  await initPromise;
};

export const getCrazyGamesErrorCode = (error: unknown) => {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as CrazyGamesSdkError).code);
  }

  return null;
};

export const isCrazyGamesUserCancellation = (error: unknown) => {
  const code = getCrazyGamesErrorCode(error);

  return code === "userCancelled" || code === "userNotAuthenticated";
};

export const getCrazyGamesEnvironment = async (): Promise<CrazyGamesEnvironment> => {
  if (isCrazyGamesSdkMocked()) {
    return "mock";
  }

  if (!environmentPromise) {
    environmentPromise = (async () => {
      await ensureCrazyGamesSdkInitialized();
      const sdk = getSdk();

      if (sdk?.environment) {
        return sdk.environment;
      }

      if (sdk?.getEnvironment) {
        return await sdk.getEnvironment();
      }

      return "crazygames";
    })().catch((error) => {
      environmentPromise = null;
      throw error;
    });
  }

  return environmentPromise;
};

export const canUseCrazyGamesSdk = async () => {
  const environment = await getCrazyGamesEnvironment();
  return environment === "local" || environment === "crazygames";
};

export const getCrazyGamesUser = async (): Promise<CrazyGamesUser | null> => {
  if (isCrazyGamesSdkMocked()) {
    return MOCK_USER;
  }

  await ensureCrazyGamesSdkInitialized();
  return (await getSdk()?.user.getUser()) ?? null;
};

export const showCrazyGamesAuthPrompt = async () => {
  if (isCrazyGamesSdkMocked()) {
    return MOCK_USER;
  }

  await ensureCrazyGamesSdkInitialized();
  return await getSdk()?.user.showAuthPrompt();
};

export const getCrazyGamesUserToken = async () => {
  if (isCrazyGamesSdkMocked()) {
    return MOCK_TOKEN;
  }

  await ensureCrazyGamesSdkInitialized();
  return (await getSdk()?.user.getUserToken()) ?? null;
};

export const addCrazyGamesAuthListener = (listener: (user: CrazyGamesUser) => void) => {
  void ensureCrazyGamesSdkInitialized().then(() => {
    getSdk()?.user.addAuthListener?.(listener);
  });
};

export const removeCrazyGamesAuthListener = (listener: (user: CrazyGamesUser) => void) => {
  getSdk()?.user.removeAuthListener?.(listener);
};
