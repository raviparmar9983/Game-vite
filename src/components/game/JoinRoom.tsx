"use client";

import { Box, Typography, LinearProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomButton } from "../shared/CustomButton";
import { joinRoomSchema } from "@/schemas";
import { useJoinGameRoom } from "@/queries";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { type ApiResponse } from "@/types";
import { CustomFormTextField } from "../shared/CustomFormTextField";
import TicTacToeBackdropLoader from "../shared/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/enums";

type JoinRoom = {
  roomCode: string;
};
export const JoinRoomForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm<JoinRoom>({
    defaultValues: { roomCode: "" },
    resolver: yupResolver(joinRoomSchema),
  });

  const { mutate, isPending } = useJoinGameRoom();

  const onSubmit = (data: JoinRoom) => {
    joinRoom(data);
  };

  const joinRoom = (data: JoinRoom) => {
    mutate(data.roomCode, {
      onSuccess: (res: ApiResponse) => {
        const { message, data } = res;
        if (data?.gameId) {
          navigate(`/game/lobby/${data.gameId}`);
          toast.success(message || "Joined room successfully");
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_DATA] });
        } else {
          toast.error("Invalid room code");
        }
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };
  if (isPending) <TicTacToeBackdropLoader />;
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Join Game Room
      </Typography>

      <LinearProgress variant="determinate" value={100} sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomFormTextField
          name="roomCode"
          control={control}
          label="Room Code"
          placeholder="Enter room code"
          fullWidth
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <CustomButton type="submit" loading={isPending}>
            Join Room
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};
