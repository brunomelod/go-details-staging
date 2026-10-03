export const DEMO_AUTH_STORAGE_KEY = "go-details-demo-auth";

export const DEMO_USERNAME = "Admin";
export const DEMO_PASSWORD = "123";

export function isDemoAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(DEMO_AUTH_STORAGE_KEY) === "1";
}

export function setDemoAuthenticated(): void {
  sessionStorage.setItem(DEMO_AUTH_STORAGE_KEY, "1");
}

export function clearDemoAuthenticated(): void {
  sessionStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
}

export function validateDemoCredentials(
  username: string,
  password: string,
): boolean {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD;
}
