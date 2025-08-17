import AppConfig from "@/config/app";
import { DependencyList, useEffect } from "react"

const useTitle = (title: string, deps?: unknown[]) => {
  useEffect(() => {
    document.title = `${title} | ${AppConfig.AppName}`;
  }, [title, ...[deps ?? []]]);
}

export default useTitle;