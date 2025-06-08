"use client";

import { treaty, Treaty } from "@elysiajs/eden";
import { createContext, useEffect, useState } from "react";

// Include API type
import { authClient } from "@/lib/auth-client";

// Import type only
import type { App } from "../../../api/src/main";

interface TreatyClient {
  client: Treaty.Create<App>;
}

export const ApiClientContext = createContext<TreatyClient | undefined>(
  undefined
);

interface ApiClientProviderProps {
  children?: React.ReactNode;
}

export default function ApiClientProvider(props: ApiClientProviderProps) {
  const [apiClient, setApiClient] = useState<TreatyClient>();
  const session = authClient.useSession();

  useEffect(() => {
    if (!session.data?.session.token) return;

    const client = treaty<App>("localhost:3000", {
      headers: {
        Authorization: `Bearer ${session.data.session.token}`,
      },
      fetch: {
        credentials: "include",
      },
      // @ts-ignore
      fetcher(url, options) {
        // fetcher includes body in GET/HEAD requests, we need to remove it to prevent fetch error
        if (
          (options?.method === undefined ||
            options?.method === "GET" ||
            options?.method === "HEAD") &&
          options?.body
        )
          delete options.body;

        return fetch(url, options);
      },
    });
    console.log(client);
    setApiClient({
      client 
    });
  }, [session.data]);

  if(!apiClient) return <></>;

  return (
    <ApiClientContext.Provider value={apiClient}>
      {props.children}
    </ApiClientContext.Provider>
  );
}
