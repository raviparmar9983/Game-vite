import { Backdrop, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const GRID = [
  [0, 1],
  [1, 1],
  [2, 2],
  [0, 2],
  [2, 0],
  [1, 0],
  [0, 0],
  [2, 1],
  [1, 2],
];

const loadingTexts = ["Loading", "Please wait", "Fetching data"];

export default function TicTacToeBackdropLoader({ open = true }) {
  const [marks, setMarks] = useState<string[]>(Array(9).fill(""));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [index, setIndex] = useState(0);

  const [text, setText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tic-Tac-Toe animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarks((prev) => {
        const newMarks = [...prev];
        const [row, col] = GRID[index];
        newMarks[row * 3 + col] = turn;
        return newMarks;
      });
      setTurn((prev) => (prev === "X" ? "O" : "X"));
      setIndex((prev) => (prev + 1) % GRID.length);
    }, 300);

    return () => clearInterval(interval);
  }, [index, turn]);

  // Typing animation
  useEffect(() => {
    const currentText = loadingTexts[textIndex % loadingTexts.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCharIndex((prev) => prev + 1);
          setText(currentText.slice(0, charIndex + 1));
          if (charIndex + 1 === currentText.length) {
            setIsDeleting(true);
          }
        } else {
          setCharIndex((prev) => prev - 1);
          setText(currentText.slice(0, charIndex - 1));
          if (charIndex === 0) {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % loadingTexts.length);
          }
        }
      },
      isDeleting ? 60 : 120,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "inline-grid",
          gridTemplateColumns: "repeat(3, 18px)",
          gap: "8px",
          padding: 2,
          borderRadius: "12px",
          border: "1px solid rgba(0,255,136,0.3)",
          backgroundColor: "rgba(255,255,255,0.04)",
          boxShadow: "0 0 24px rgba(0, 255, 136, 0.2)",
        }}
      >
        {marks.map((mark, i) => (
          <Box
            key={i}
            sx={{
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: mark === "X" ? "#00ccff" : "#00ff88",
              fontFamily: "Orbitron, sans-serif",
              transition: "all 0.2s ease",
            }}
          >
            {mark}
          </Box>
        ))}
      </Box>

      <Typography
        variant="caption"
        sx={{
          mt: 2,
          fontFamily: "Courier New, monospace",
          color: "#00ff88",
          fontSize: "0.85rem",
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {text}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: "8px",
            height: "1em",
            backgroundColor: "#00ff88",
            ml: "4px",
            animation: "blink 1.2s ease-in-out infinite",
          }}
        />
      </Typography>

      <style>{`
@keyframes blink {
  0%, 100% { opacity: 1; }
  40%, 60% { opacity: 0; }
}
`}</style>
    </Backdrop>
  );
}
