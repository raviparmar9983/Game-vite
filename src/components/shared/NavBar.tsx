import { AppBar, Toolbar, Box, Typography, Avatar, Chip } from "@mui/material";
import { CustomButton } from "./CustomButton";

interface GameNavbarProps {
  userName: string;
  coins: number;
  isGuest?: boolean;
  onLogin?: () => void;
  isLoginLoading?: boolean;
}

const GameNavbar = ({ userName, coins, isGuest = false, onLogin, isLoginLoading = false }: GameNavbarProps) => {
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 70,
        }}
      >
        {/* Left: User Info */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "#000",
              fontWeight: 700,
            }}
          >
            {userName?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {userName}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1.5}>
          {isGuest && onLogin ? (
            <CustomButton onClick={onLogin} loading={isLoginLoading} size="small">
              Login with CrazyGames
            </CustomButton>
          ) : null}

          <Chip
            label={
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#00ff88",
                }}
              >
                {isGuest ? "Guest mode" : "Signed in"}
              </Typography>
            }
            sx={{
              px: 1,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          />

          <Chip
            icon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: "6px",
                }}
              >
                <img src="/coin.png" alt="coin" width={24} height={24} />
              </Box>
            }
            label={
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#00ff88",
                }}
              >
                {coins}
              </Typography>
            }
          sx={{
            px: 1,
            py: 2.5,
            background: "rgba(0, 255, 136, 0.1)",
            border: "1px solid rgba(0, 255, 136, 0.35)",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 0 15px rgba(0, 255, 136, 0.6)",
            },
          }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default GameNavbar;
