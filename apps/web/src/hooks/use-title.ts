import AppConfig from "@/config/app";
import { useEffect } from "react"

const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${AppConfig.AppName}`;
  }, [title]);
}

export default useTitle;