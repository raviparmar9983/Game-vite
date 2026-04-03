
import React from "react";
import { Box, Typography, Button, Stack, Grid, useTheme } from "@mui/material";
import { CustomModal } from "../shared/CustomModal";

interface DailyRewardModalProps {
  open: boolean;
  onClose: () => void;
  rewardCoins: number;
  streak: number; // 1 → 7
}

const DAILY_REWARDS = [1000, 2000, 3000, 4000, 5000, 6000, 11000];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  open,
  onClose,
  rewardCoins,
  streak,
}) => {
  const theme = useTheme();

  return (
    <CustomModal open={open} onClose={onClose} animation="grow" size="sm">
      <Stack spacing={3} alignItems="center">
        {/* Title */}
        <Typography variant="h4">🎁 Daily Login Reward</Typography>

        {/* Reward Amount */}
        <Box
          sx={{
            px: 4,
            py: 2,
            borderRadius: 3,
            background: "linear-gradient(135deg, #00ff88, #00ccff)",
            color: "#000",
            boxShadow: "0 0 30px rgba(0,255,136,0.5)",
          }}
        >
          <Typography variant="h2" fontWeight={700}>
            +{rewardCoins} 🪙
          </Typography>
        </Box>

        {/* Streak Info */}
        <Typography color="text.secondary">
          Login Streak: <b>Day {streak} / 7</b>
        </Typography>

        {/* 7 Day Reward Track */}
        <Grid container spacing={1} justifyContent="center">
          {DAILY_REWARDS.map((coins, index) => {
            const day = index + 1;
            const isActive = day === streak;
            const isClaimed = day < streak;

            return (
              <Grid size={{ xs: 3 }} key={day}>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    textAlign: "center",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: isActive ? theme.palette.primary.main : "rgba(255,255,255,0.15)",
                    background: isActive
                      ? "rgba(0,255,136,0.15)"
                      : isClaimed
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                    boxShadow: isActive ? "0 0 15px rgba(0,255,136,0.5)" : "none",
                  }}
                >
                  <div>Day {day}</div>
                  <div>{coins} 🪙</div>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* CTA */}
        <Button variant="contained" color="primary" fullWidth onClick={onClose}>
          Awesome!
        </Button>
      </Stack>
    </CustomModal>
  );
};
