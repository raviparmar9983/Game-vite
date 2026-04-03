
import React, { useEffect, useState, useMemo } from "react";
import { IconsMap } from "@/icons/IconMap";
import { useAppSelector } from "@/lib/hooks";

/* ================= TYPES ================= */

export interface Player {
  _id: string;
  icon: string;
  name?: string;
}

export interface MovePayload {
  row: number;
  col: number;
  playerId: string;
}

interface GridProps {
  gridSize: number;
  players: Player[];
  currTurn: string;
  onMove?: (payload: MovePayload) => void;
  gridData: string[][];
}

/* ================= COMPONENT ================= */

const GameGrid: React.FC<GridProps> = ({ gridSize, players, currTurn, onMove, gridData }) => {
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const user = useAppSelector((s) => s.user);

  /* ================= GRID INIT ================= */

  useEffect(() => {
    if (Array.isArray(gridData) && gridData.length > 0) {
      setGrid(gridData);
    } else {
      setGrid(Array.from({ length: gridSize }, () => Array(gridSize).fill(null)));
    }
  }, [gridData, gridSize]);

  /* ================= TURN LOGIC ================= */

  const isMyTurn = useMemo(() => {
    return currTurn === user?._id;
  }, [currTurn, user?._id]);

  const currentPlayer = useMemo(() => players.find((p) => p._id === currTurn), [players, currTurn]);

  /* ================= CLICK HANDLER ================= */

  const handleCellClick = (r: number, c: number) => {
    if (!isMyTurn) return;
    if (!currentPlayer) return;
    if (grid[r][c] !== null) return;

    onMove?.({
      row: r,
      col: c,
      playerId: currentPlayer._id,
    });
  };

  /* ================= UI CALCULATIONS ================= */

  const iconSize = useMemo(() => {
    if (gridSize <= 4) return 36;
    if (gridSize <= 6) return 30;
    if (gridSize <= 9) return 22;
    return 16; // 10–12
  }, [gridSize]);

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        pointerEvents: "auto",

        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        aspectRatio: "1 / 1",

        width: "100%",
        maxWidth: "min(92vw, 420px)",
        margin: "0 auto",

        gap: "4px",
        padding: "6px",
        background: "#1e1e1e",
        borderRadius: "12px",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const clickable = isMyTurn && cell === null;

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => {
                if (clickable) handleCellClick(r, c);
              }}
              style={{
                pointerEvents: "auto",

                background: clickable ? "#333" : "#2a2a2a",
                borderRadius: "8px",
                cursor: clickable ? "pointer" : "default",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                userSelect: "none",
                transition: "background 0.15s ease",
              }}
            >
              {/* ICON */}
              <div
                style={{
                  width: iconSize,
                  height: iconSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                {cell && IconsMap[cell]}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameGrid;
