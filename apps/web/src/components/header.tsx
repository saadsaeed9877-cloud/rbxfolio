import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex flex-col leading-none tracking-tight group">
          <span className="text-2xl font-black text-primary transition-all group-hover:brightness-125">RBX</span>
          <span className="text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">Portfolio</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/browse" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Browse
          </Link>
          <Link href="/search" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Search
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="ghost" className="px-6 border border-border/50 text-foreground">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="px-6">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
