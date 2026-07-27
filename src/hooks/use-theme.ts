import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

function getSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("scoreflow-theme") as Theme) || "dark"; 
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let appliedTheme: "light" | "dark";
    if (theme === "system") {
      appliedTheme = getSystemTheme();
    } else {
      appliedTheme = theme;
    }

    root.classList.add(appliedTheme);
    localStorage.setItem("scoreflow-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  return { theme, setTheme };
}
