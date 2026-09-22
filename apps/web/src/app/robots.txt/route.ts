export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const body = `User-agent: *
Allow: /
Allow: /u/
Disallow: /dashboard/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
