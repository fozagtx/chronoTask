"use client";

import { CivicAuthProvider } from "@civic/auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  if (!clientId) {
    return <>{children}</>;
  }

  return <CivicAuthProvider clientId={clientId}>{children}</CivicAuthProvider>;
}
