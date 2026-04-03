import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let gameTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ff88",
      light: "#4dffaa",
      dark: "#00cc6a",
    },
    secondary: {
      main: "#ff6b35",
      light: "#ff8a65",
      dark: "#e64a19",
    },
    background: {
      default: "#0a0a0a",
      paper: "rgba(20, 20, 30, 0.6)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    error: {
      main: "#ff4d4f",
    },
    success: {
      main: "#00ff88",
    },
    info: {
      main: "#00ccff",
    },
    warning: {
      main: "#ffcc00",
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      color: "#00ff88",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#ffffff",
    },
    body1: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      color: "#ffffff",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(to right, #00ccff, #00ff88)",
          color: "#000",
          "&:hover": {
            background: "linear-gradient(to right, #00b8e6, #00e673)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            color: "#ffffff",
            "& fieldset": {
              borderColor: "rgba(0, 255, 136, 0.25)",
              borderWidth: "1px",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 255, 136, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00ff88",
              borderWidth: "2px",
              boxShadow: "0 0 8px rgba(0, 255, 136, 0.4)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)",
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1em",
            "&.Mui-focused": {
              color: "#00ff88",
            },
          },
          "& .MuiOutlinedInput-input": {
            color: "#ffffff",
            fontWeight: 500,
            padding: "12px 14px",
          },
          "& .MuiFormHelperText-root": {
            color: "#ff6b35",
            marginLeft: 0,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(20, 20, 30, 0.4)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#fff",
        },
        standardError: {
          borderColor: "#ff4d4f",
          backgroundColor: "rgba(255, 77, 79, 0.1)",
        },
        standardSuccess: {
          borderColor: "#00ff88",
          backgroundColor: "rgba(0, 255, 136, 0.1)",
        },
        standardInfo: {
          borderColor: "#00ccff",
          backgroundColor: "rgba(0, 204, 255, 0.1)",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontWeight: 600,
          fontSize: "2rem",
          textAlign: "center",
          background: "linear-gradient(45deg, #00ff88, #00ccff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
        },
      },
    },
  },
});

gameTheme = responsiveFontSizes(gameTheme);

export { gameTheme };
