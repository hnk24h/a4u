/** Resolve the public site origin for metadata and crawler files. */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const candidate = configured || (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000");

  try {
    const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
}
