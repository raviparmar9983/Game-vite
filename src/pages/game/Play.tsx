import CurrentTurnDisplay from "@/components/game/CurrentPlayer";
import DynamicGridIntegrated from "@/components/game/GridComponent";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import { useSocket } from "@/context";
import { useGame } from "@/queries";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const params = useParams();
  const navigate = useNavigate();
  const gameId = params["id"] as string;
  const { socket } = useSocket();

  const { data: gameResp, isLoading, isError } = useGame(gameId);

  const [game, setGame] = useState<any>(null);

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
      socket.off("GAME_COMPLETE");
      socket.off("GAME_UPDATED", handler);
    };
  }, [socket, gameId, navigate]);

  useEffect(() => {
    if (!socket) return;

    const onSocketError = (data: { message: string }) => {
      const msg = data?.message || "Something went wrong";

      toast.error(msg);

      if (msg.includes("game_not_found") || msg.includes("You are not Part of this game")) {
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
  }, [socket, gameId, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
      navigate("/");
    }
  }, [isError, navigate]);

  if (isLoading || !game) {
    return <TicTacToeBackdropLoader />;
  }

  const handleCellClick = (data: any) => {
    if (!socket || !gameId) return;
    socket.emit("PLAY_MOVE", { ...data, gameId });
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

export default Page;
