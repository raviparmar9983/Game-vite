import { memo, forwardRef } from "react";
import { Button, type ButtonProps, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

// Extend MUI's ButtonProps with custom prop
interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

// Custom styled MUI button
const StyledButton = styled(Button)(() => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    // boxShadow: theme.shadows[3],
  },
}));

// Base component using forwardRef
const CustomButtonBase = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      variant = "contained",
      color = "primary",
      size = "medium",
      startIcon,
      endIcon,
      fullWidth = false,
      loading = false,
      disabled = false,
      onClick,
      sx,
      ...rest
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        color={color}
        size={size}
        startIcon={!loading && startIcon}
        endIcon={!loading && endIcon}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        onClick={onClick}
        sx={sx}
        {...rest}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : children}
      </StyledButton>
    );
  }
);

// Optional display name for better debugging
CustomButtonBase.displayName = "CustomButton";

// Export memoized version for performance
const CustomButton = memo(CustomButtonBase);

export { CustomButton };
