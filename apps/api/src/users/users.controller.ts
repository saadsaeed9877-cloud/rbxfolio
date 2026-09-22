import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "../auth/public.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get(":username")
  getPublicProfile(@Param("username") username: string) {
    return this.usersService.getPublicProfile(username);
  }
}
