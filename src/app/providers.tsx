"use client";

import ReactQueryProvider from "@/providers/react-query-provider";
import SonnerToaster from "@/providers/sonner-toaster";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <SonnerToaster />
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </AppRouterCacheProvider>
    </ReactQueryProvider>
  );
}
