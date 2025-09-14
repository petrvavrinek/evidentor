"use client";

import { useTheme } from "next-themes";


interface AppLogoProps {
  className?: string
}

const AppLogo = ({ className }: AppLogoProps) => {
  const theme = useTheme();
  const mode = theme.resolvedTheme ?? "light";
  const src = mode === "dark" ? "/logo-white.svg" : "/logo-black.svg";
  return <img src={src} className={className}/>
}
export default AppLogo;