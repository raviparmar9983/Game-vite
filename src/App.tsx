import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/dashboard/Home";
import GameLobbyPage from "./pages/game/GameLobbyPage";
import PlayPage from "./pages/game/Play";
import BotLobbyPage from "./pages/game/BotLobbyPage";
import BotPlayPage from "./pages/game/BotPlayPage";
import GameResultPage from "./pages/game/GameResultPage";
import TicTacToeBackdropLoader from "./components/shared/Loader";
import { CrazyGamesAuthProvider, useCrazyGamesAuthContext } from "@/context";

function AppRoutes() {
  const { sdkInitialized, isLoading, user, backendUser, error } = useCrazyGamesAuthContext();

  if (isLoading || !sdkInitialized) {
    return <TicTacToeBackdropLoader />;
  }

  return (
    <>
      {error ? <div className="sdk-auth-banner">{error}</div> : null}

      <Routes>
        <Route element={<DashboardLayout crazyGamesUser={user} backendUser={backendUser} />}>
          <Route path="/" element={<Home />} />
          <Route path="/game/lobby/:room-id" element={<GameLobbyPage />} />
          <Route path="/game/play/:id" element={<PlayPage />} />
          <Route path="/game/bot/lobby/:room-id" element={<BotLobbyPage />} />
          <Route path="/game/bot/play/:room-id" element={<BotPlayPage />} />
          <Route path="/game/result/:room-id" element={<GameResultPage />} />
        </Route>

        <Route path="/auth/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CrazyGamesAuthProvider>
      <AppRoutes />
    </CrazyGamesAuthProvider>
  );
}

export default App;
