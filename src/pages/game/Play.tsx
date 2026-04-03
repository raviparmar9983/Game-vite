import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card } from "@mui/material";
import toast from "react-hot-toast";

import { useSocket } from "@/context";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import * as Icons from "@/icons/GameIcon";

interface Player {
  _id: string;
  userName: string;
  icon?: string;
}

const PlayPage = () => {
  const { id: gameId } = useParams();
  const navigate = useNavigate();

  const { socket } = useSocket();

  const [players, setPlayers] = useState<Player[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Join game
  useEffect(() => {
    if (!socket || !gameId) return;

    socket.emit("joinGame", { gameId });

    socket.on("gameState", (data) => {
      setPlayers(data.players);
      setGrid(data.grid);
      setCurrentTurn(data.currentTurn);
      setLoading(false);
    });

    socket.on("gameOver", (data) => {
      toast.success(`Winner: ${data.winner}`);
    });

    socket.on("ERROR", (err) => {
      toast.error(err.message);
      navigate("/");
    });

    return () => {
      socket.off("gameState");
      socket.off("gameOver");
      socket.off("ERROR");
    };
  }, [socket, gameId]);

  const handleMove = (row: number, col: number) => {
    if (!socket || !gameId) return;

    socket.emit("makeMove", { gameId, row, col });
  };

  if (loading) return <TicTacToeBackdropLoader />;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Game Room
      </Typography>

      {/* Players */}
      <Grid container spacing={2} mb={4}>
        {players.map((player) => {
          const IconComponent = player.icon ? (Icons as any)[player.icon] : null;

          return (
            <Grid size={{ xs: 6 }} key={player._id}>
              <Card sx={{ p: 2 }}>
                <Typography fontWeight={600}>{player.userName}</Typography>

                {IconComponent && (
                  <Box mt={1}>
                    <IconComponent width={30} height={30} />
                  </Box>
                )}

                {currentTurn === player._id && (
                  <Typography color="primary">Your Turn</Typography>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Game Grid */}
      <Grid container spacing={1} maxWidth={300}>
        {grid.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <Grid size={{ xs: 4 }} key={`${rIndex}-${cIndex}`}>
              <Card
                sx={{
                  height: 80,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleMove(rIndex, cIndex)}
              >
                <Typography variant="h4">{cell}</Typography>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default PlayPage;