import { GameIcon } from "@/icons/icons";
import { Box, Chip, Tooltip, IconButton } from "@mui/material";
import { forwardRef, memo, useCallback } from "react";
import toast from "react-hot-toast";

interface CodeChipProps {
  label: string;
  color?: "primary" | "secondary" | "default";
}

// Forward ref to allow parent access
const CodeChip = forwardRef<HTMLDivElement, CodeChipProps>(({ label, color = "primary" }, ref) => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(label);
    toast.success("Code copied to clipboard!");
  }, [label]);

  return (
    <Tooltip title="Click to copy code">
      <Chip
        ref={ref}
        label={
          <Box display="flex" alignItems="center" gap={1}>
            <span>{label}</span>
            <IconButton size="small" onClick={handleCopy} sx={{ color: "inherit" }}>
              <GameIcon fontSize="small" />
            </IconButton>
          </Box>
        }
        color={color}
        variant="outlined"
        sx={{ fontWeight: 600, fontSize: "1rem", py: 1, px: 2 }}
      />
    </Tooltip>
  );
});

CodeChip.displayName = "CodeChip";
// Use memo to prevent unnecessary re-renders
export const CustomeCodeChip = memo(CodeChip);
