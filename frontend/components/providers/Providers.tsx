"use client";

import { SessionProvider } from "next-auth/react";
import AuthProvider from "./AuthProvider";
import { Toaster } from "react-hot-toast";
import GoogleSync from "./GoogleSync";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <Toaster />
        <GoogleSync />
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
