import React, { createContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export default function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState("dark"); 
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                background: { default: "#fafafa", paper: "#fff" },
              }
            : {
                primary: { main: "#9c27b0" },
                background: { default: "#000", paper: "#121212" },
              }),
        },
        shape: { borderRadius: 8 },
        typography: { fontFamily: "Roboto, sans-serif" },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
