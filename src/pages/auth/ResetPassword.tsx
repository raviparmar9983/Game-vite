import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPasswordSchema } from "@/schemas";
import { CustomButton, CustomFormTextField } from "@/components";
import { useResetPassword } from "@/queries";
import { type ApiResponse } from "@/types";

type ResetPasswordInputs = {
  hash: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const { mutate, isPending } = useResetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { control, handleSubmit, reset } = useForm<ResetPasswordInputs>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      hash: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Reset token is missing or invalid.");
      navigate("/auth/login", { replace: true });
    }
  }, [token, navigate]);

  const onSubmit: SubmitHandler<ResetPasswordInputs> = (formData) => {
    if (!token) {
      toast.error("Missing token. Cannot reset password.");
      return;
    }

    mutate(
      {
        token,
        password: formData.hash,
      },
      {
        onSuccess: (res: ApiResponse) => {
          toast.success(res?.message || "Password reset successful!");
          reset();

          setTimeout(() => {
            navigate("/auth/login");
          }, 2000);
        },
        onError: (error: Error) => {
          const errorMessage =
            error?.message || "Failed to reset password. Please try again.";
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        maxWidth: 420,
        width: "100%",
        mx: "auto",
        backdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 1,
        p: 4,
      }}
    >
      <Typography variant="h4" align="center">
        Reset Password
      </Typography>

      <Typography
        align="center"
        sx={{ mb: 3, color: "#b0b0b0", fontSize: "0.95rem" }}
      >
        Enter your new password and confirm it to reset access.
      </Typography>

      <CustomFormTextField
        name="hash"
        control={control}
        label="New Password"
        type="password"
        margin="normal"
      />

      <CustomFormTextField
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        type="password"
        margin="normal"
      />

      <CustomButton
        fullWidth
        type="submit"
        variant="contained"
        loading={isPending}
        sx={{ mt: 2 }}
      >
        Reset Password
      </CustomButton>
    </Box>
  );
}
