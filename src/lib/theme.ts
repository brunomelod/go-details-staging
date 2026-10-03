export type ThemeMode = "dark" | "light";

export const THEME_STORAGE_KEY = "go-details-theme";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(THEME_STORAGE_KEY);
  return v === "light" ? "light" : "dark";
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
