import  { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { SocketProvider } from "@/context";
import { useAppDistpatch } from "@/lib/hooks";
import { setUser } from "@/lib/reducers/userReducer";
import { useUserProfileQuery } from "@/queries";

function DashboardLayout() {
  const { data: user, isLoading } = useUserProfileQuery();
  const dispatch = useAppDistpatch();

  useEffect(() => {
    if (user && !isLoading) {
      dispatch(setUser(user.data));
    }
  }, [user, isLoading, dispatch]);

  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}

export default DashboardLayout;