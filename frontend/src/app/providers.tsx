import type { ReactNode } from "react";
import { ThemeProvider } from "../context/ThemeContext";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
