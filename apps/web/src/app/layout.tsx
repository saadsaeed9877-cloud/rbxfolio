import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/design-system";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RbxFolio — Roblox Developer Portfolios",
    template: "%s | RbxFolio",
  },
  description:
    "Create a professional portfolio to showcase your Roblox development work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
