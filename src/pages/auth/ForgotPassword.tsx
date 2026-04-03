import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { forgotPasswordSchema } from "@/schemas";
import { CustomButton, CustomFormTextField } from "@/components";
import { useForgotPassword } from "@/queries";
import { type ApiResponse } from "@/types";
import { Link } from "react-router-dom";

type ForgotPasswordInputs = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { mutate, isPending } = useForgotPassword();

  const { control, handleSubmit, reset } = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (formData) => {
    mutate(formData, {
      onSuccess: (res: ApiResponse) => {
        toast.success(res?.message || "Reset link sent!");
        reset();
      },
      onError: (error: Error) => {
        toast.error(error?.message || "Failed to send reset link.");
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 420,
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 1,
        p: 4,
      }}
    >
      <Typography variant="h4" align="center">
        Forgot Password
      </Typography>

      <Typography align="center" sx={{ mb: 3, color: "#b0b0b0" }}>
        Enter your email to receive reset link.
      </Typography>

      <CustomFormTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        margin="normal"
        fullWidth
      />

      <CustomButton
        fullWidth
        type="submit"
        variant="contained"
        loading={isPending}
      >
        Send Reset Link
      </CustomButton>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 3, color: "#b0b0b0" }}
      >
        Remembered your password?{" "}
        <Link
          to="/auth/login"
          style={{
            color: "#00ccff",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Go back to login
        </Link>
      </Typography>
    </Box>
  );
}
