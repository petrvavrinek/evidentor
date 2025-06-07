"use client";

import { authClient } from "@/lib/auth-client";
import { LoaderIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

interface AuthProtectProps {
  children?: React.ReactNode;
}

export default function AuthProtect(props: AuthProtectProps) {
  const session = authClient.useSession();
  if (session.isPending) return <LoaderIcon className="animate-spin" />;

  if (!session.data) {
    redirect("/auth");
    return <div>Not signed in</div>;
  }

  return props.children;
}
