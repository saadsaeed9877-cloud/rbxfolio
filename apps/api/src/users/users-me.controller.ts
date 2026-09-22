import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/session.guard";

@Controller("users/me")
export class UsersMeController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  getMyProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.getMyProfile(user.id);
  }

  @Patch("profile")
  updateProfile(@CurrentUser() user: AuthUser, @Body() body: unknown) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  uploadAvatar(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(user.id, file);
  }

  @Post("banner")
  @UseInterceptors(FileInterceptor("file"))
  uploadBanner(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadBanner(user.id, file);
  }
}
