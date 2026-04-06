import { useParams, useNavigate } from "react-router-dom";
import  { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Box } from "@mui/material";
import CurrentTurnDisplay from "@/components/game/CurrentPlayer";
import DynamicGridIntegrated from "@/components/game/GridComponent";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import CustomJoyride from "@/components/shared/CustomJoyride";
import { useTour } from "@/hooks/useTour";
import { useSocket } from "@/context";
import { useGame } from "@/queries";

const BotPlayPage = () => {
  const { "room-id": gameId } = useParams();
  const navigate = useNavigate();

  const { socket } = useSocket();

  const { data: gameResp, isLoading, isError } = useGame(gameId as string);

  const [game, setGame] = useState<any>(null);

  // const { runTour, handleTourComplete } = useTour("bot-play");
  // const tourSteps: any[] = [
  //   {
  //     target: "#tour-play-players",
  //     content: "These are the players in the bot match. Keep an eye out for the 'Your Turn' indicator!",
  //     disableBeacon: true,
  //   },
  //   {
  //     target: "#tour-play-grid",
  //     content: "This is the game board. Place your move here.",
  //   }
  // ];

  useEffect(() => {
    if (gameResp) setGame(gameResp);
  }, [gameResp]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joingameplay", { gameId });

    const handler = (updatedGame: any) => {
      setGame(updatedGame);
    };

    socket.on("GAME_UPDATED", handler);

    socket.on("GAME_COMPLETE", () => {
      navigate(`/game/result/${gameId}`, { replace: true });
    });

    return () => {
      socket.off("GAME_UPDATED", handler);
      socket.off("GAME_COMPLETE");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onSocketError = (data: { message: string }) => {
      const msg = data?.message || "Something went wrong";

      toast.error(msg);

      if (msg.includes("game_not_found")) {
        navigate("/");
        return;
      }

      if (msg.includes("Game not Start")) {
        navigate(`/game/lobby/${gameId}`);
        return;
      }

      if (msg.includes("completed")) {
        navigate(`/game/result/${gameId}`);
        return;
      }

      if (msg.includes("Wrong turn") || msg.includes("Cell already filled")) {
        return;
      }

      navigate("/");
    };

    socket.on("ERROR", onSocketError);

    return () => {
      socket.off("ERROR", onSocketError);
    };
  }, [socket, gameId]);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
      navigate("/");
    }
  }, [isError]);

  if (isLoading || !game) {
    return <TicTacToeBackdropLoader />;
  }

  const handleCellClick = (data: any) => {
    if (!socket || !gameId) return;

    socket.emit("PLAY_BOT_MOVE", { ...data, gameId });
  };

  return (
    <>
      <CurrentTurnDisplay players={game.players} currTurn={game.currTurn} />

      <DynamicGridIntegrated
        gridSize={game.size}
        players={game.players}
        currTurn={game.currTurn}
        gridData={game.grid}
        onMove={(data) => handleCellClick(data)}
      />
    </>
  );
};

export default BotPlayPage;
