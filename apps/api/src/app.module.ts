import { config } from "dotenv";
import { join } from "path";

config({ path: join(__dirname, "../../../.env") });
config({ path: join(__dirname, "../.env") });

import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ServeStaticModule } from "@nestjs/serve-static";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProjectsModule } from "./projects/projects.module";
import { MediaModule } from "./media/media.module";
import { ContactRequestsModule } from "./contact-requests/contact-requests.module";
import { SearchModule } from "./search/search.module";
import { SentryInterceptor } from "./common/sentry.interceptor";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: "default", ttl: 60000, limit: 100 },
      { name: "contact", ttl: 3600000, limit: 5 },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), process.env.UPLOAD_DIR || "./uploads"),
      serveRoot: "/uploads",
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    MediaModule,
    ContactRequestsModule,
    SearchModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
