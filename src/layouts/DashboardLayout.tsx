import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { SocketProvider } from "@/context";
import { useAppDistpatch } from "@/lib/hooks";
import { setUser } from "@/lib/reducers/userReducer";
import type { BackendAuthUser, CrazyGamesUser } from "@/types/crazyGames";

interface DashboardLayoutProps {
  crazyGamesUser: CrazyGamesUser | null;
  backendUser: BackendAuthUser | null;
}

const toStoreUser = (crazyGamesUser: CrazyGamesUser | null, backendUser: BackendAuthUser | null) => {
  if (backendUser) {
    return {
      _id: backendUser._id ?? backendUser.id ?? crazyGamesUser?.userId ?? "",
      userName: backendUser.userName ?? backendUser.username ?? crazyGamesUser?.username ?? "Guest",
      email: backendUser.email ?? "",
      coins: backendUser.coins ?? 0,
    };
  }

  return {
    _id: crazyGamesUser?.userId ?? "",
    userName: crazyGamesUser?.username ?? "Guest",
    email: "",
    coins: 0,
  };
};

function DashboardLayout({ crazyGamesUser, backendUser }: DashboardLayoutProps) {
  const dispatch = useAppDistpatch();

  useEffect(() => {
    dispatch(setUser(toStoreUser(crazyGamesUser, backendUser)));
  }, [crazyGamesUser, backendUser, dispatch]);

  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}

export default DashboardLayout;
