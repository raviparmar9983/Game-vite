import { Box } from "@mui/material";
import { type ReactNode, useMemo } from "react";

interface AnimatedBackgroundProps {
  children: ReactNode;
  enableGridAnimation?: boolean;
  enableConicEffect?: boolean;
  backgroundColor?: string;
}

const baseStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  position: "relative",
  overflow: "hidden",
  padding: "2rem 1rem",
};

const gridOverlayStyle = {
  content: '""',
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(0,255,136,0.1)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
  opacity: 0.3,
  animation: "gridMove 20s linear infinite",
  zIndex: 0,
};

const conicEffectStyle = {
  content: '""',
  position: "absolute",
  top: "10%",
  left: "10%",
  width: "80%",
  height: "80%",
  background: "conic-gradient(from 0deg, transparent, rgba(0, 255, 136, 0.1), transparent)",
  borderRadius: "50%",
  animation: "rotate 30s linear infinite",
  pointerEvents: "none",
  zIndex: 0,
};

export function AnimatedBackground({
  children,
  enableGridAnimation = true,
  enableConicEffect = true,
  backgroundColor = "#0a0a0a",
}: AnimatedBackgroundProps) {
  const backgroundLayers = useMemo(
    () =>
      [
        "radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.08), transparent 50%)",
        "radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.08), transparent 50%)",
        "radial-gradient(circle at 40% 60%, rgba(0, 204, 255, 0.08), transparent 50%)",
        `linear-gradient(135deg, ${backgroundColor} 0%, #1a1a2e 50%, #16213e 100%)`,
      ].join(","),
    [backgroundColor]
  );

  return (
    <Box
      component="main"
      sx={{
        ...baseStyle,
        background: backgroundLayers,
        "::before": enableGridAnimation ? gridOverlayStyle : undefined,
        "::after": enableConicEffect ? conicEffectStyle : undefined,
      }}
    >
      {children}
    </Box>
  );
}
