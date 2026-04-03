import { type AppStore, makeStore } from "@/lib";
import { useRef } from "react";
import { Provider } from "react-redux";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};