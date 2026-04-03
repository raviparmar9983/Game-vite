import { CreateRoomForm, CustomModal, CustomButton } from "@/components";
import { useCallback, useEffect, useState } from "react";
import { useUserProfileQuery } from "@/queries";
import TicTacToeBackdropLoader from "@/components/shared/Loader";
import { useAppDistpatch } from "@/lib/hooks";
import { setUser } from "@/lib/reducers/userReducer";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Card, Grid } from "@mui/material";

import { JoinRoomForm } from "@/components/game/JoinRoom";
import GameNavbar from "@/components/shared/NavBar";
import { DailyRewardModal } from "@/components/game/DailyReward";
import { CreateBotRoomForm } from "@/components/game/CreateBotRoom";

const DashBoardPage = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openJoinRoom, setJoinRoomOpen] = useState(false);
  const [dailyJoinRoom, setDailyRewardOpen] = useState(false);
  const [createBotOpen, setCreateBotOpen] = useState(false);

  const handleJoinRoomOpen = useCallback(() => setJoinRoomOpen(true), []);
  const handleJoinRoomClose = useCallback(() => setJoinRoomOpen(false), []);
  const handleDailyJoinOpen = useCallback(() => setDailyRewardOpen(true), []);
  const handleDailyJoinClose = useCallback(() => setDailyRewardOpen(false), []);
  const handleCreateBotOpen = useCallback(() => setCreateBotOpen(true), []);
  const handleCreateBotClose = useCallback(() => setCreateBotOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const { data: user, isLoading } = useUserProfileQuery();
  const dispatch = useAppDistpatch();

  useEffect(() => {
    if (user && !isLoading) dispatch(setUser(user.data));
  }, [user, isLoading, dispatch]);

  useEffect(() => {
    if (user?.data?.rewardedToday) {
      handleDailyJoinOpen();
    }
  }, [user?.data?.rewardedToday]);

  if (isLoading || !user) return <TicTacToeBackdropLoader />;

  return (
    <>
      <GameNavbar userName={user?.data?.userName} coins={user?.data?.coins} />

      <Box
        sx={{
          px: 2,
          py: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Glow */}
        <Box
          sx={{
            width: 280,
            height: 280,
            position: "absolute",
            top: 60,
            right: 50,
            background: "rgba(0,150,255,0.18)",
            filter: "blur(140px)",
            borderRadius: "50%",
          }}
        />

        <Box
          sx={{
            width: 260,
            height: 260,
            position: "absolute",
            bottom: 60,
            left: 50,
            background: "rgba(255,0,120,0.18)",
            filter: "blur(150px)",
            borderRadius: "50%",
          }}
        />

        <Card
          sx={{
            width: "100%",
            maxWidth: 620,
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 4px 35px rgba(0,0,0,0.10), 0 0 25px rgba(0,150,255,0.15)",
            animation: "floatUp 6s ease-in-out infinite",
          }}
        >
          <Typography variant="h4" fontWeight={800} textAlign="center">
            Welcome,{" "}
            <Box component="span" sx={{ color: "#1976d2" }}>
              {user?.data?.userName}
            </Box>
          </Typography>

          <Typography textAlign="center" sx={{ mt: 1, mb: 4 }}>
            Ready to create your next game room?
          </Typography>

          <Box textAlign="center" mb={2}>
            <CustomButton onClick={handleCreateBotOpen} fullWidth>
              Play now
            </CustomButton>
          </Box>

          <Box textAlign="center">
            <CustomButton onClick={handleOpen} fullWidth>
              + Create Game Room
            </CustomButton>
          </Box>

          <Grid container spacing={2} mt={2}>
            {[
              {
                label: "Join Room",
                action: handleJoinRoomOpen,
                route: null,
              },
              // {
              //   label: "How to Play",
              //   action: null,
              //   route: "/how-to-play",
              // },
            ].map((b, i) => (
              <Grid size={{ xs: 12 }} key={i}>
                <CustomButton
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    if (b.action) b.action();
                    else if (b.route) navigate(b.route);
                  }}
                >
                  {b.label}
                </CustomButton>
              </Grid>
            ))}
          </Grid>
        </Card>

        {/* Modals */}

        <CustomModal open={open} onClose={handleClose} animation="slide" anchor="right">
          <CreateRoomForm />
        </CustomModal>

        <CustomModal open={openJoinRoom} onClose={handleJoinRoomClose} animation="slide" anchor="right">
          <JoinRoomForm />
        </CustomModal>

        <CustomModal open={createBotOpen} onClose={handleCreateBotClose} animation="slide" anchor="right">
          <CreateBotRoomForm />
        </CustomModal>

        <style>
          {`
          @keyframes floatUp {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
        </style>
      </Box>

      <DailyRewardModal
        open={dailyJoinRoom}
        onClose={handleDailyJoinClose}
        rewardCoins={user?.data?.rewardCoins}
        streak={user?.data?.loginStreak}
      />
    </>
  );
};

export default DashBoardPage;