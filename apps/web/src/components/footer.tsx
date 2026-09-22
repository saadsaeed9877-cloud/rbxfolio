import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
        <p>RbxFolio — Professional portfolios for Roblox developers.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/browse" className="hover:text-foreground">Browse</Link>
          <Link href="/search" className="hover:text-foreground">Search</Link>
        </div>
      </div>
    </footer>
  );
}
