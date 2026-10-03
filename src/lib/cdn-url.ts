/** Encode chars that break Next.js image optimizer fetches (e.g. unescaped parentheses). */
export function normalizeWebflowCdnUrl(url: string): string {
  return url.replace(/\(/g, "%28").replace(/\)/g, "%29");
}
