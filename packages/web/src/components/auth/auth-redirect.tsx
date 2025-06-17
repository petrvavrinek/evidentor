"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";
import { client } from "@/lib/api/client.gen";

interface AuthProtectProps {
  children?: React.ReactNode;
}

export default function AuthProtect({ children }: AuthProtectProps) {
  const router = useRouter();
  const session = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [clientProvider, setClientProvider] = useState<QueryClient>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !session.isPending && !session.data) {
      router.replace("/auth");
    }

    // Init client once
    if (!clientProvider) setClientProvider(new QueryClient());
  }, [isMounted, session.isPending, session.data, router]);

  useEffect(() => {
    if (session.data?.session.token) {
      // Configure internal service client
      client.setConfig({
        credentials: "include",
        headers: {
          Authorization: `Bearer ${session.data.session.token}`,
        },
      });
    }
  }, [clientProvider, session]);

  if (!isMounted || session.isPending || !clientProvider) {
    return <Skeleton className="w-full h-1.5" />;
  }

  if (!session.data) return <p>Redirecting...</p>;

  return (
    <QueryClientProvider client={clientProvider}>
      {children}
    </QueryClientProvider>
  );
}
