"use client";

import PageHeader from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Session } from "better-auth";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

interface SessionItemProps {
  ipAddress?: string | null;
  userAgent?: string | null;
  current?: boolean;
  onDelete?: () => void;
}

const SessionItem = ({
  ipAddress,
  userAgent,
  current,
  onDelete,
}: SessionItemProps) => {
  const parser = new UAParser(userAgent || "");
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return (
    <Card className="py-4 px-6 space-y-3">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">
          {ipAddress || "Unknown IP"}
        </CardTitle>

        <div className="flex items-center gap-2">
          {current && <Badge className="p-2">Current session</Badge>}
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <div>
          <strong>Browser:</strong> {browser.name || "Unknown"}{" "}
          {browser.version || ""}
        </div>
        <div>
          <strong>OS:</strong> {os.name || "Unknown"} {os.version || ""}
        </div>
        <div>
          <strong>User Agent:</strong> {userAgent || "Not provided"}
        </div>
      </CardContent>
    </Card>
  );
};

export default function SessionsPage() {
  const { data: sessionData } = authClient.useSession();
  const [sessions, setSessions] = useState<Session[] | undefined>();

  useEffect(() => {
    authClient.listSessions().then((e) => {
      setSessions(e.data ?? []);
    });
  }, []);

  return (
    <>
      <PageHeader title="Sessions" subtitle="Active sesions" />

      {sessions ? (
        <div className="space-y-2">
          {sessions.map((e) => (
            <SessionItem
              key={e.id}
              userAgent={e.userAgent}
              ipAddress={e.ipAddress}
              current={sessionData?.session.id === e.id}
              onDelete={() => {
                authClient.revokeSession({ token: e.token }).then((res) => {
                  if (res.data?.status && sessionData?.session.id === e.id)
                    redirect("/auth");
                });
              }}
            />
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
