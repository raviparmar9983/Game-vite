import { QueryProvider } from "./QueryProvider";
import { AnimatedBackground } from "@/components";
import { ThemeRegistry } from "./ThemeProvider";
import { StoreProvider } from "./StoreProvider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeRegistry>
        <QueryProvider>
          <StoreProvider>
            <AnimatedBackground>{children}</AnimatedBackground>
          </StoreProvider>
        </QueryProvider>
      </ThemeRegistry>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(20, 20, 30, 0.6)",
            color: "#fff",
            border: "1px solid rgba(0, 255, 136, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 25px rgba(0, 255, 136, 0.2)",
            borderRadius: "12px",
            fontFamily: '"Orbitron", "Roboto", sans-serif',
          },
        }}
      />
    </>
  );
}