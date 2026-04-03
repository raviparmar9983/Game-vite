import { Box, Container } from "@mui/material";
import  { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm" >
         <Box sx={{ width: "100%" }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}