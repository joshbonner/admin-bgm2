import { Button } from "@mui/material";
import styled from "@mui/styled-engine";

export const StyledButtonPrimary = styled(Button)(({ theme }) => ({
  background: "#fff",
  color: "#333",
  [`&:hover`]: {
    background: "#333",
    color: "#fff",
  },
  [`&.Mui-disabled`]: {
    background: "#a6a6a6",
    color: "#333",
  },
}));

export const StyledButtonSuccess = styled(Button)(({ theme }) => ({
  background: "#fff",
  color: "#333",
  [`&:hover`]: {
    background: "#333",
    color: "#fff",
  },
  [`&.Mui-disabled`]: {
    background: "#a6a6a6",
    color: "#333",
  },
}));

export const StyledButtonWarning = styled(Button)(({ theme }) => ({
  background:
    theme.mode === "dark"
      ? "#000"
      : "linear-gradient(249.33deg, #F3AA1A 36.3%, rgba(237, 176, 85, 0.47) 103.74%)",
  color: "#fff",
}));

export const StyledButtonError = styled(Button)(({ theme }) => ({
  background:
    theme.mode === "dark"
      ? "#000"
      : "linear-gradient(249.33deg, #950000 36.3%, rgba(223, 117, 117, 0.67) 103.74%)",
  color: "#fff",
}));
