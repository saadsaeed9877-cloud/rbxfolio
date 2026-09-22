import { apiFetchServer } from "@/lib/api";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  let usernames: string[] = [];

  try {
    const result = await apiFetchServer<{
      data: { username: string }[];
    }>("/browse?limit=100");
    usernames = result.data.map((d) => d.username);
  } catch {
    usernames = [];
  }

  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/browse`,
    `${baseUrl}/search`,
    ...usernames.map((u) => `${baseUrl}/u/${u}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
