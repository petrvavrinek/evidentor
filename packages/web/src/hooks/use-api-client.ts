"use client";

import { ApiClientContext } from "@/contexts/api-client.context";
import { useContext } from "react";

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  return context?.client!;
};
