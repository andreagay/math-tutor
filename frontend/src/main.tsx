import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import axios from "axios";
import { Toaster } from "react-hot-toast";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://tutormatematica.me/api/v1"
    : "http://localhost:4000/api/v1";
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography: { fontFamily: "Roboto", allVariants: { color: "white" } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
          <Toaster position="top-right" />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
