"use client";

import { AuthorizationProvider } from "@/context/AuthorizationContext";

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthorizationProvider>{children}</AuthorizationProvider>;
}