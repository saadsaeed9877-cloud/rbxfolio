import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { SessionGuard } from "./session.guard";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [EmailModule],
  providers: [
    SessionGuard,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
  ],
})
export class AuthModule {}
