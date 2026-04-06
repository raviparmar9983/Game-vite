import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Grid, Card, CardActionArea, Typography, Box, Avatar, Button, Chip } from "@mui/material";
import * as Icons from "@/icons/GameIcon";
import { useAppSelector } from "@/lib/hooks";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import { useSocket } from "@/context";
import { CustomeCodeChip } from "@/components/shared/CustomChip";
import { useGame } from "@/queries";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/enums";
import CustomJoyride from "@/components/shared/CustomJoyride";
import { useTour } from "@/hooks/useTour";

interface Player {
  _id: string;
  userName: string;
  email?: string;
  isConnected?: boolean;
  isReady?: boolean;
  icon?: string;
  roomCode?: string;
}

const GameLobbyPage = () => {
  const { "room-id": gameId } = useParams();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user);

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostId, setHostId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const iconKeys = Object.keys(Icons);

  const { data: gameResp, isLoading: gameLoading } = useGame(gameId as string);

  const takenIcons = players.map((p) => p.icon).filter(Boolean) as string[];

  const myPlayer = players.find((p) => p._id === currentUser._id);
  const mySelectedIcon = myPlayer?.icon || selectedIcon;

  const { runTour, handleTourComplete } = useTour("lobby");
  const tourSteps: any[] = [
    {
      target: "#tour-lobby-room-code",
      content: "This is your Room Code. Share it with your friends so they can join!",
      disableBeacon: true,
    },
    {
      target: "#tour-lobby-icons",
      content: "Claim your identity before the game begins. Select an available icon.",
    },
    {
      target: "#tour-lobby-players",
      content: "Here you can see who has joined and if they are ready.",
    },
    {
      target: "#tour-lobby-start-game",
      content: "Once everyone is ready, the Host can start the game here!",
    }
  ];

  // Join room
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
      debugger
      navigate(`/game/play/${gameId}`);
    };

    socket.on("playerJoined", onPlayerJoined);
    socket.on("gameStarted", onGameStart);

    return () => {
      socket.off("playerJoined", onPlayerJoined);
      socket.off("gameStarted", onGameStart);
    };
  }, [socket, gameId]);

  // Player updates
  useEffect(() => {
    if (!socket) return;

    const onPlayerUpdated = (data: { players: Player[] }) => {
      setPlayers(data.players || []);

      const me = data.players.find((p) => p._id === currentUser._id);

      if (me?.icon) {
        setSelectedIcon(me.icon);
      }
    };

    socket.on("playerUpdated", onPlayerUpdated);

    return () => {
      socket.off("playerUpdated", onPlayerUpdated);
    };
  }, [socket, currentUser._id]);

  // Error handling
  useEffect(() => {
    if (!socket) return;

    const onSocketError = (data: { message: string }) => {
      const msg = data?.message || "Something went wrong";

      toast.error(msg);
      setIsLoading(false);

      if (msg.includes("Game already started") || msg.includes("icon locked")) {
        navigate(`/game/play/${gameId}`);
        return;
      } else if (msg.includes("Game not found") || msg.includes("Not allowed")) {
        navigate("/");
        return;
      } else if (
        msg.includes("Icon already taken") ||
        msg.includes("All players must select icon")
      ) {
        return;
      } else {
        navigate("/");
      }
    };

    socket.on("ERROR", onSocketError);

    return () => {
      socket.off("ERROR", onSocketError);
    };
  }, [socket, gameId]);

  useEffect(() => {
    const me = players.find((p) => p._id === currentUser._id);

    if (me?.icon) {
      setSelectedIcon(me.icon);
    }
  }, [players, currentUser._id]);

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
      }
    );
  };

  const handleGameStart = () => {
    if (!socket || !gameId) return;

    socket.emit("startGame", { gameId });
  };

  if (isLoading || gameLoading) return <TicTacToeBackdropLoader />;

  return (
    <Box>
      <CustomJoyride steps={tourSteps} run={runTour} onComplete={handleTourComplete} />
      
      <Box id="tour-lobby-room-code" display="inline-block" mb={2}>
        <CustomeCodeChip label={gameResp?.roomCode ?? ""} />
      </Box>

      <Typography variant="h5">Choose Your Icon</Typography>

      <Grid id="tour-lobby-icons" container spacing={2} mb={4}>
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
                  border: isSelected ? "2px solid #00ff88" : "1px solid rgba(255,255,255,0.1)",
                  opacity: disabled ? 0.4 : 1,
                  transition: "all 0.3s ease",
                  transform: isSelected ? "scale(1.1)" : "scale(1)",
                  boxShadow: isSelected ? "0 0 15px rgba(0, 255, 136, 0.6)" : "none",
                  zIndex: isSelected ? 10 : 1,
                  "&:hover": {
                    transform: disabled ? "none" : "scale(1.05)",
                    borderColor: disabled ? "" : "#00ccff",
                    boxShadow: disabled ? "none" : "0 0 10px rgba(0, 204, 255, 0.4)"
                  }
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

      <Box id="tour-lobby-start-game" mt={3} mb={4}>
        <Button variant="contained" onClick={handleGameStart}>
          Start Game
        </Button>
      </Box>

      <Typography variant="h6">Players in Room</Typography>

      <Grid id="tour-lobby-players" container spacing={2}>
        {players.map((player) => {
          const IconComponent = player.icon ? (Icons as any)[player.icon] : null;
          const isMe = player._id === currentUser._id;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={player._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <Box display="flex" gap={2} alignItems="center">
                  <Avatar>{player.userName?.[0]}</Avatar>

                  <Box>
                    <Typography fontWeight={600}>{player.userName}</Typography>

                    <Box display="flex" gap={1}>
                      {hostId === player._id && <Chip label="Host" size="small" />}
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

export default GameLobbyPage;