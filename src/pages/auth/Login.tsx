import { type SubmitHandler, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "@/schemas";
import {
  CustomFormTextField,
  CustomCheckbox,
  CustomButton,
} from "@/components";
import { useLoginUser } from "@/queries";

type LoginFormInputs = {
  email: string;
  hash: string;
  rememberMe?: boolean;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLoginUser();

  const { control, handleSubmit } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", hash: "", rememberMe: false },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    mutate(data as any, {
      onSuccess: (res: any) => {
        const { message, token } = res;

        if (!token?.accessToken) {
          toast.error("Unexpected response");
          return;
        }

        Cookies.set("accessToken", token.accessToken, {
          expires: data.rememberMe ? 7 : undefined,
        });

        toast.success(message || "Login successful");

        navigate("/", { replace: true });
      },
      onError: (error: Error) => {
        toast.error(error?.message || "Login failed");
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        maxWidth: 420,
        backdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 1,
        p: 4,
      }}
    >
      <Typography variant="h4" align="center">
        Welcome Back
      </Typography>

      <Typography
        align="center"
        sx={{ mb: 3, color: "#b0b0b0", fontSize: "0.95rem" }}
      >
        Enter your credentials to access the dashboard.
      </Typography>

      <CustomFormTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        margin="normal"
        fullWidth
      />

      <CustomFormTextField
        name="hash"
        control={control}
        label="Password"
        type="password"
        margin="normal"
        fullWidth
      />

      <CustomCheckbox name="rememberMe" control={control} label="Remember Me" />

      <CustomButton
        fullWidth
        type="submit"
        variant="contained"
        loading={isPending}
      >
        Login
      </CustomButton>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2, color: "#b0b0b0" }}
      >
        <Link
          to="/auth/forgot-password"
          style={{
            color: "#00ccff",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Forgot Password?
        </Link>
      </Typography>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 1, color: "#b0b0b0" }}
      >
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          style={{
            color: "#00ff88",
            textDecoration: "underline",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Register here
        </Link>
      </Typography>
    </Box>
  );
}
