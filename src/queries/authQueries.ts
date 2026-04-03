import { loginUser, registerUser, forgotPassword, resetPassword } from "@/services";
import { useMutation } from "@tanstack/react-query";

export const useLoginUser = () => {
  return useMutation({ mutationFn: loginUser });
};

export const useRegisterUser = () => {
  return useMutation({ mutationFn: registerUser });
};

export const useForgotPassword = () => {
  return useMutation({ mutationFn: forgotPassword });
};

export const useResetPassword = () => {
  return useMutation({ mutationFn: resetPassword });
};
