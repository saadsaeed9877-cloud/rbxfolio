import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getMediaUrl, formatRole } from "@/lib/utils";
import { User } from "lucide-react";

interface DeveloperCardProps {
  developer: {
    username: string;
    displayName: string;
    tagline: string | null;
    primaryRole: string;
    profilePictureUrl: string | null;
    availability?: string;
  };
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const avatarUrl = getMediaUrl(developer.profilePictureUrl);

  return (
    <Link href={`/u/${developer.username}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden bg-card border-border transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,76,0.1)]">
        <div className="relative h-24 w-full bg-gradient-to-r from-secondary to-background overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        
        <div className="relative px-5 pb-5 flex-1 flex flex-col">
          <div className="absolute -top-10 left-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border-4 border-card bg-secondary transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/50">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {developer.displayName}
              </h3>
            </div>
            <p className="text-sm font-medium text-primary mt-1">
              {formatRole(developer.primaryRole)}
            </p>
            {developer.tagline && (
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {developer.tagline}
              </p>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">12</span>
              <span>Projects</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">8.2K</span>
              <span>Views</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
