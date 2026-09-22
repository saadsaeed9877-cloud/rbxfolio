import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ContactRequestsService } from "./contact-requests.service";
import { Public } from "../auth/public.decorator";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/session.guard";

@Controller()
export class ContactRequestsController {
  constructor(private readonly contactRequestsService: ContactRequestsService) {}

  @Public()
  @Throttle({ contact: { limit: 5, ttl: 3600000 } })
  @Post("users/:username/contact-requests")
  submit(
    @Param("username") username: string,
    @Body() body: unknown,
  ) {
    return this.contactRequestsService.submit(username, body);
  }

  @Get("users/me/contact-requests")
  list(@CurrentUser() user: AuthUser) {
    return this.contactRequestsService.listForDeveloper(user.id);
  }

  @Get("users/me/contact-requests/count")
  countPending(@CurrentUser() user: AuthUser) {
    return this.contactRequestsService.countPending(user.id).then((count) => ({
      pending: count,
    }));
  }

  @Patch("users/me/contact-requests/:id")
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    return this.contactRequestsService.updateStatus(user.id, id, body);
  }
}
