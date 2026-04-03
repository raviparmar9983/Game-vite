import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
} from "@mui/material";
import * as Icons from "@/icons/GameIcon";
import { useAppSelector } from "@/lib/hooks";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import { useSocket } from "@/context";
import { CustomeCodeChip } from "@/components/shared/CustomChip";
import { useGame } from "@/queries";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/enums";

interface Player {
  _id: string;
  userName: string;
  email?: string;
  isConnected?: boolean;
  isReady?: boolean;
  icon?: string;
}

const BotLobbyPage = () => {
  const { "room-id": gameId } = useParams();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user);
  const { socket } = useSocket();

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostId, setHostId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const iconKeys = Object.keys(Icons);

  const { data: gameResp, isLoading: gameLoading } = useGame(gameId as string);

  const takenIcons = players.map((p) => p.icon).filter(Boolean) as string[];

  const myPlayer = players.find((p) => p._id === currentUser._id);
  const mySelectedIcon = myPlayer?.icon || selectedIcon;

  useEffect(() => {
    if (!socket || !gameId) return;

    socket.emit("joinRoom", { gameId });

    const onPlayerJoined = (data: { players: Player[]; host?: string }) => {
      setPlayers(data.players || []);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_DATA] });

      if (data.host) setHostId(data.host);

      setIsLoading(false);
    };

    const onGameStart = () => {
      navigate(`/game/bot/play/${gameId}`);
    };

    socket.on("playerJoined", onPlayerJoined);
    socket.on("gameStarted", onGameStart);

    return () => {
      socket.off("playerJoined", onPlayerJoined);
      socket.off("gameStarted", onGameStart);
    };
  }, [socket, gameId]);

  useEffect(() => {
    if (!socket) return;

    const onPlayerUpdated = (data: { players: Player[] }) => {
      setPlayers(data.players || []);

      const me = data.players.find((p) => p._id === currentUser._id);

      if (me?.icon) setSelectedIcon(me.icon);
    };

    socket.on("playerUpdated", onPlayerUpdated);

    return () => {
      socket.off("playerUpdated", onPlayerUpdated);
    };
  }, [socket, currentUser._id]);

  useEffect(() => {
    if (!socket) return;

    const onSocketError = (data: { message: string }) => {
      const msg = data?.message || "Something went wrong";

      toast.error(msg);
      setIsLoading(false);

      if (msg.includes("Game already started")) {
        navigate(`/game/play/${gameId}`);
        return;
      }

      if (msg.includes("Game not found")) {
        navigate("/");
        return;
      }

      if (msg.includes("Icon already taken")) return;

      navigate("/");
    };

    socket.on("ERROR", onSocketError);

    return () => {
      socket.off("ERROR", onSocketError);
    };
  }, [socket, gameId]);

  const handleSelectIcon = (iconName: string) => {
    if (!socket || !gameId) return;
    if (actionInProgress) return;
    if (mySelectedIcon) return;

    if (takenIcons.includes(iconName)) {
      setErrorMessage("Icon already taken");
      return;
    }

    setActionInProgress(true);
    setErrorMessage(null);

    socket.emit(
      "selectIcon",
      { gameId, icon: iconName },
      (ack: { status: boolean; players?: Player[]; message?: string }) => {
        setActionInProgress(false);

        if (ack?.status) {
          if (ack.players) setPlayers(ack.players);

          setSelectedIcon(iconName);
        } else {
          setErrorMessage(ack?.message || "Failed to select icon");
        }
      },
    );
  };

  const handleGameStart = () => {
    if (!socket || !gameId) return;

    socket.emit("startGame", { gameId });
  };

  if (isLoading || gameLoading) return <TicTacToeBackdropLoader />;

  return (
    <Box>
      <CustomeCodeChip label={gameResp?.roomCode ?? ""} />

      <Typography variant="h5" gutterBottom>
        Choose Your Icon
      </Typography>

      <Grid container spacing={2} mb={4}>
        {iconKeys.map((iconName) => {
          const IconComponent = (Icons as any)[iconName];

          const isTaken = takenIcons.includes(iconName);
          const isSelected = mySelectedIcon === iconName;

          const disabled =
            actionInProgress ||
            (isTaken && !isSelected) ||
            (!!mySelectedIcon && !isSelected);

          return (
            <Grid size={{ xs: 3 }} key={iconName}>
              <Card
                sx={{
                  border: isSelected ? "2px solid #1976d2" : "1px solid #ddd",
                  opacity: disabled ? 0.4 : 1,
                }}
              >
                <CardActionArea
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) handleSelectIcon(iconName);
                  }}
                >
                  <Box display="flex" justifyContent="center" p={2} height={80}>
                    <IconComponent width={50} height={50} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {errorMessage && (
        <Typography color="error" mt={1}>
          {errorMessage}
        </Typography>
      )}

      <Box mt={3} mb={4}>
        <Button variant="contained" onClick={handleGameStart}>
          Start Game
        </Button>
      </Box>

      <Typography variant="h6">Players in Room</Typography>

      <Grid container spacing={2}>
        {players.map((player) => {
          const IconComponent = player.icon
            ? (Icons as any)[player.icon]
            : null;
          const isMe = player._id === currentUser._id;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={player._id}>
              <Card
                sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
              >
                <Box display="flex" gap={2} alignItems="center">
                  <Avatar>{player.userName?.[0]}</Avatar>

                  <Box>
                    <Typography fontWeight={600}>{player.userName}</Typography>

                    <Box display="flex" gap={1}>
                      {hostId === player._id && (
                        <Chip label="Host" size="small" />
                      )}
                      <Chip
                        label={player.isReady ? "Ready" : "Not Ready"}
                        color={player.isReady ? "success" : "default"}
                        size="small"
                      />
                    </Box>

                    {IconComponent ? (
                      <Box display="flex" mt={1}>
                        <IconComponent width={26} height={26} />
                      </Box>
                    ) : (
                      <Typography variant="body2">No icon selected</Typography>
                    )}
                  </Box>
                </Box>

                {isMe && (
                  <Button
                    variant={player.isReady ? "outlined" : "contained"}
                    color={player.isReady ? "success" : "secondary"}
                  >
                    {player.isReady ? "Unready" : "Mark Ready"}
                  </Button>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BotLobbyPage;
