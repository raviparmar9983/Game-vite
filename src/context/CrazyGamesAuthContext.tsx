import { createContext, useContext } from "react";
import { useCrazyGamesAuth, type CrazyGamesAuthState } from "@/hooks/useCrazyGamesAuth";

const CrazyGamesAuthContext = createContext<CrazyGamesAuthState | undefined>(undefined);

export const CrazyGamesAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useCrazyGamesAuth();

  return <CrazyGamesAuthContext.Provider value={auth}>{children}</CrazyGamesAuthContext.Provider>;
};

export const useCrazyGamesAuthContext = () => {
  const context = useContext(CrazyGamesAuthContext);

  if (!context) {
    throw new Error("useCrazyGamesAuthContext must be used inside CrazyGamesAuthProvider");
  }

  return context;
};
