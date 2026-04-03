import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

import { type RegisterFormInputs, registerSchema } from "@/schemas";
import {
  CustomFormTextField,
  // CustomCheckbox,
  CustomButton,
} from "@/components";
import { useRegisterUser } from "@/queries";

export default function RegisterPage() {
  const { mutate, isPending } = useRegisterUser();
  const [isRegistered, setIsRegistered] = React.useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      hash: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: any) => {
    const userPayload = { ...data };

    if (userPayload.birthDate) {
      userPayload.birthDate = new Date(userPayload.birthDate).toISOString();
    }

    mutate(userPayload as RegisterFormInputs, {
      onSuccess: (res) => {
        toast.success(res.message);
        navigate("/auth/login");
        reset();
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <>
      {isRegistered ? (
        <Box
          sx={{
            maxWidth: 420,
            width: "100%",
            mx: "auto",
            textAlign: "center",
            p: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
            color: "#fff",
          }}
        >
          <Typography variant="h4">Verify Your Email ✉️</Typography>

          <Typography sx={{ mb: 3, color: "#b0b0b0" }}>
            We've sent a verification link to your email. Please check your
            inbox and confirm your email address to complete the registration.
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2, borderColor: "#00ccff", color: "#00ccff" }}
            onClick={() => setIsRegistered(false)}
          >
            Back to Sign Up
          </Button>
        </Box>
      ) : (
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
            Create Account
          </Typography>

          <Typography
            align="center"
            sx={{ mb: 3, color: "#b0b0b0", fontSize: "0.95rem" }}
          >
            Join the future. Fast, secure, and stylish sign-up.
          </Typography>

          <CustomFormTextField
            name="userName"
            control={control}
            label="User Name"
            margin="normal"
          />

          <CustomFormTextField
            name="email"
            control={control}
            label="Email"
            type="email"
            margin="normal"
          />

          <CustomFormTextField
            name="hash"
            control={control}
            label="Password"
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

          {/* <CustomCheckbox
            name="agreeTerms"
            control={control}
            label="I agree to the terms"
          /> */}

          <CustomButton
            fullWidth
            type="submit"
            variant="contained"
            loading={isPending}
            sx={{ mt: 2 }}
          >
            Register
          </CustomButton>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "#b0b0b0" }}
          >
            Already have an account?{" "}
            <Link
              to="/auth/login"
              style={{
                color: "#00ff88",
                textDecoration: "underline",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Login here
            </Link>
          </Typography>
        </Box>
      )}
    </>
  );
}
