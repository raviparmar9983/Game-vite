import { Route, Routes } from "react-router-dom";
import "./App.css";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/dashboard/Home";
import GameLobbyPage from "./pages/game/GameLobbyPage";
import PlayPage from "./pages/game/Play";
import BotLobbyPage from "./pages/game/BotLobbyPage";
import BotPlayPage from "./pages/game/BotPlayPage";
import GameResultPage from "./pages/game/GameResultPage";

function App() {
  return (
    <>
      <Routes>
        {/* public routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/game/lobby/:room-id" element={<GameLobbyPage />} />
            <Route path="/game/play/:id" element={<PlayPage />} />
            <Route path="/game/bot/lobby/:room-id" element={<BotLobbyPage />} />
            <Route path="/game/bot/play/:room-id" element={<BotPlayPage />} />
            <Route path="/game/result/:room-id" element={<GameResultPage />} />
            {/* <Route path="/how-to-play" element={<HowToPlayPage />} /> */}
            {/* <Route path="/game/lobby/:id" element={<Lobby />} /> */}
            {/* <Route path="/game/:id" element={<Game />} /> */}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
