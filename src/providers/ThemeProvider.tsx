import { gameTheme } from "@/lib";
import { ThemeProvider, CssBaseline } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export const ThemeRegistry: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={gameTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};