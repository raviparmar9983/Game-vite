import { Box, Typography, Grid, Button, LinearProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createRoomSchema } from "@/schemas";
import { useCreateBotRoom } from "@/queries"; // <-- create new mutation hook
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { type ApiResponse, type CreateRoomFormInputs } from "@/types";
import { CustomButton } from "../shared/CustomButton";
import { useAppSelector } from "@/lib/hooks";
import { useMemo } from "react";
import { CustomFormTextField } from "../shared/CustomFormTextField";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/enums";

export const CreateBotRoomForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.user);

  const schema = useMemo(() => createRoomSchema(user.coins || 0), [user.coins]);

  const { control, handleSubmit, watch, setValue } = useForm<CreateRoomFormInputs>({
    defaultValues: {
      gridSize: 3,
      playerCount: 2, // always 2 (user vs bot)
      entryFee: 0,
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isPending } = useCreateBotRoom(); // <-- bot api

  const gridSize = watch("gridSize");

  const onSubmit = (data: CreateRoomFormInputs) => {
    createBotRoom({
      ...data,
      playerCount: 2, // force always 2
    });
  };

  const createBotRoom = (data: CreateRoomFormInputs) => {
    mutate(data, {
      onSuccess: (res: ApiResponse) => {
        const { message, data } = res;
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_DATA] });
        
        navigate(`/game/bot/lobby/${data?._id}`);
        toast.success(message);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Room
      </Typography>

      <LinearProgress variant="determinate" value={100} sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Coins */}
        <CustomFormTextField
          name="entryFee"
          control={control}
          label="Coins"
          type="number"
          margin="normal"
          fullWidth
        />

        {/* Grid size */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Choose Grid Size
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[3, 4, 5, 6].map((size) => (
            <Grid size={{ xs: 4, sm: 3 }} key={size}>
              <Button
                fullWidth
                variant={gridSize === size ? "contained" : "outlined"}
                onClick={() => setValue("gridSize", size)}
              >
                {size}×{size}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Info text */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You will play against AI Bot (1v1 match)
        </Typography>

        {/* Submit */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <CustomButton type="submit" loading={isPending}>
            Create Bot Room
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};
