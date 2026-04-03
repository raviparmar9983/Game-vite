
import React from "react";
import { IconsMap } from "@/icons/IconMap";
import { useAppSelector } from "@/lib/hooks";

interface CurrentTurnProps {
  players: any[];
  currTurn: string;
}

const CurrentTurnDisplay: React.FC<CurrentTurnProps> = ({ players, currTurn }) => {
  const user = useAppSelector((state) => state.user);

  const currentPlayer = players.find((p) => p._id === currTurn);
  if (!currentPlayer) return null;

  const isMyTurn = currentPlayer._id === user?._id;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 20px",
        borderRadius: "14px",
        marginBottom: "16px",
        border: isMyTurn ? "2px solid #4ade80" : "1px solid rgba(255,255,255,0.15)",
        background: isMyTurn ? "rgba(74, 222, 128, 0.15)" : "rgba(255, 255, 255, 0.06)",
        boxShadow: isMyTurn ? "0 0 12px rgba(74, 222, 128, 0.4)" : "none",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* ICON */}
      <div
        style={{
          fontSize: "32px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: isMyTurn ? "rgba(74, 222, 128, 0.2)" : "rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {IconsMap[currentPlayer.icon]}
      </div>

      {/* TEXT */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "14px",
            opacity: 0.75,
            fontWeight: 500,
            letterSpacing: "0.3px",
          }}
        >
          {isMyTurn ? "Your Turn" : "Current Turn"}
        </span>

        <span
          style={{
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {currentPlayer.userName}
        </span>
      </div>
    </div>
  );
};

export default CurrentTurnDisplay;
