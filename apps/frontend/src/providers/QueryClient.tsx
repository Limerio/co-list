"use client";
import {
  QueryClientProvider,
  QueryClient as TanStackQueryClient,
} from "@tanstack/react-query";
import { ReactNode } from "react";

export const QueryClient = ({ children }: { children: ReactNode }) => {
  const queryClient = new TanStackQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
