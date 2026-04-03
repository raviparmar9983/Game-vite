import { Container, Typography, Box, Grid, Chip, Stack } from "@mui/material";

const scoringRules = [
  {
    title: "Row Completion",
    description:
      "When a player completes a full horizontal row with their icon, they earn points.",
    image: "/rules/score-row.png",
  },
  {
    title: "Column Completion",
    description:
      "Completing a vertical column also gives points.",
    image: "/rules/score-column.png",
  },
  {
    title: "Diagonal Completion",
    description:
      "Completing a diagonal earns points as well.",
    image: "/rules/score-diagonal.png",
  },
  {
    title: "Multiple Patterns in One Move",
    description:
      "A single move can complete multiple patterns.",
    image: "/rules/score-multiple.png",
  },
];

export default function HowToPlayPage() {
  return (
    <Box>
      {/* <BackToDashboardButton /> */}

      <Container maxWidth="lg">
        <Box textAlign="center" mt={2}>
          <Typography variant="h3" fontWeight={800}>
            How Scoring Works
          </Typography>

          <Typography variant="body1" color="text.secondary">
            TACTRA is a skill-based multiplayer grid game.
          </Typography>
        </Box>

        {scoringRules.map((rule, index) => (
          <Box key={index} mb={8}>
            <Grid
              container
              spacing={6}
              alignItems="center"
              direction={index % 2 === 0 ? "row" : "row-reverse"}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 320,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={rule.image}
                    alt={rule.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Chip label="+1 Point • +Cells" color="success" sx={{ mb: 2 }} />

                <Typography variant="h4">{rule.title}</Typography>

                <Typography color="text.secondary">{rule.description}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Box mt={10} p={6} borderRadius={4}>
          <Typography variant="h4">Scoring & Winning Rules</Typography>

          <Stack spacing={2} mt={3}>
            <Typography>Each completed row/column/diagonal gives +1 point</Typography>
            <Typography>Every pattern counts as 1 block</Typography>
            <Typography>Player with more points wins</Typography>
            <Typography>If equal → player with more blocks wins</Typography>
            <Typography>If both equal → Game Draw</Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}