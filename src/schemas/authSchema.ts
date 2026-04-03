import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  hash: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

export const registerSchema = yup.object({
  userName: yup.string().required("User name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  hash: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("hash")], "Passwords must match")
    .required("Confirm your password"),
  // agreeTerms: yup.boolean().oneOf([true], "You must accept the terms"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  hash: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("hash")], "Passwords must match")
    .required("Please confirm your password"),
});

export type RegisterFormInputs = yup.InferType<typeof registerSchema>;
