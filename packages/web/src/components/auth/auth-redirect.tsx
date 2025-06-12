"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React from "react";
import { Skeleton } from "../ui/skeleton";

interface AuthProtectProps {
  children?: React.ReactNode;
}

export default function AuthProtect(props: AuthProtectProps) {
  const session = authClient.useSession();
  if (session.isPending) return <Skeleton className="w-full h-1.5" />;

  if (!session.data) {
    redirect("/auth");
    return <div>Not signed in</div>;
  }

  return props.children;
}
