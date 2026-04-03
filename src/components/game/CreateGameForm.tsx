
import  { type ReactElement, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  BeeIcon,
  BoltIcon,
  CircleIcon,
  CrossIcon,
  CrownIcon,
  DangerIcon,
  MagnetIcon,
  PlanetIcon,
  RocketIcon,
  SkullIcon,
  SpiralIcon,
  StarIcon,
} from "@/icons";
import { gridSchema, playerCountSchema, playerDetailsSchema } from "@/schemas";
import { CustomFormTextField } from "../shared/CustomFormTextField";
import { CustomFormSelect } from "../shared/CustomSelect";

export type GameIconItem = {
  id: string;
  label: string;
  icon: (props: any) => ReactElement;
};

export const GAME_ICONS: GameIconItem[] = [
  { id: "cross", label: "Cross", icon: CrossIcon },
  { id: "circle", label: "Circle", icon: CircleIcon },
  { id: "star", label: "Star", icon: StarIcon },
  { id: "bolt", label: "Bolt", icon: BoltIcon },
  { id: "spiral", label: "Spiral", icon: SpiralIcon },
  { id: "skull", label: "Skull", icon: SkullIcon },
  { id: "danger", label: "Danger", icon: DangerIcon },
  { id: "rocket", label: "Rocket", icon: RocketIcon },
  { id: "bee", label: "Bee", icon: BeeIcon },
  { id: "magnet", label: "Magnet", icon: MagnetIcon },
  { id: "crown", label: "Crown", icon: CrownIcon },
  { id: "planet", label: "Planet", icon: PlanetIcon },
];

type FormValues = {
  gridSize: number;
  playerCount: number;
  playerNames: { name: string; iconId: string }[];
};

const steps = ["Grid Configuration", "Player Setup", "Player Details"];

export const CreateGameForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const getStepSchema = (step: number): any => {
    switch (step) {
      case 0:
        return gridSchema;
      case 1:
        return playerCountSchema;
      case 2:
        return playerDetailsSchema;
      default:
        return gridSchema;
    }
  };

  const { control, handleSubmit, watch, setValue, trigger } = useForm<FormValues>({
    defaultValues: {
      gridSize: 3,
      playerCount: 2,
      playerNames: [],
    },
    resolver: yupResolver(getStepSchema(activeStep)),
  });

  const { fields } = useFieldArray({
    control,
    name: "playerNames",
  });

  const gridSize = watch("gridSize");
  const playerCount = watch("playerCount");
  // const playerNames = watch('playerNames');

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    if (activeStep === 1) {
      const players = Array.from({ length: playerCount }, (_, i) => ({
        name: `Player ${i + 1}`,
        iconId: "",
      }));
      setValue("playerNames", players);
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = () => {};
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Choose Grid Size
            </Typography>
            <Grid container spacing={2}>
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                <Grid size={3} key={size}>
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
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Select Number of Players
            </Typography>
            <CustomFormSelect
              name="playerCount"
              control={control}
              label="Players"
              defaultValue={2}
              options={Array.from({ length: 11 }, (_, i) => ({
                label: `${i + 2} Players`,
                value: i + 2,
              }))}
            />
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Customize Players
            </Typography>
            {fields.map((field, index) => {
              const SelectedIcon = GAME_ICONS.find((icon) => icon.id === field.iconId)?.icon;

              // const usedIcons = playerNames
              //   .filter((_, i) => i !== index)
              //   .map((p) => p.iconId);

              // const iconOptions = GAME_ICONS.map((icon) => ({
              //   label: icon.label,
              //   value: icon.id,
              //   disabled: usedIcons.includes(icon.id),
              //   icon: icon.icon,
              // }));

              return (
                <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar>{field.name.charAt(0)}</Avatar>
                      <CustomFormTextField
                        name={`playerNames.${index}.name`}
                        control={control}
                        label="Player Name"
                      />
                    </Box>

                    <CustomFormSelect
                      name={`playerNames.${index}.iconId`}
                      control={control}
                      label="Icon"
                      defaultValue=""
                      options={GAME_ICONS.map((icon) => ({
                        label: icon.label,
                        value: icon.id,
                        icon: icon.icon,
                      }))}
                    />

                    {SelectedIcon && (
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="caption">Preview:</Typography>
                        <SelectedIcon fontSize="large" color="primary" />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create New Game
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <LinearProgress
        variant="determinate"
        value={(activeStep / (steps.length - 1)) * 100}
        sx={{ mb: 3 }}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          {activeStep > 0 && (
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained">
              Start Game
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};
