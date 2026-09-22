import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProjectsService } from "./projects.service";
import { Public } from "../auth/public.decorator";
import { OptionalUser } from "../auth/optional-user.decorator";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/session.guard";

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get("projects/:id")
  getProject(@Param("id") id: string, @OptionalUser() user?: AuthUser) {
    return this.projectsService.getProject(id, user?.id);
  }

  @Get("users/me/projects")
  listMyProjects(@CurrentUser() user: AuthUser) {
    return this.projectsService.listMyProjects(user.id);
  }

  @Post("users/me/projects")
  createProject(@CurrentUser() user: AuthUser, @Body() body: unknown) {
    return this.projectsService.createProject(user.id, body);
  }

  @Patch("users/me/projects/:id")
  updateProject(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    return this.projectsService.updateProject(user.id, id, body);
  }

  @Delete("users/me/projects/:id")
  deleteProject(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.projectsService.deleteProject(user.id, id);
  }

  @Post("users/me/projects/:id/media")
  @UseInterceptors(FileInterceptor("file"))
  uploadMedia(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.uploadMedia(user.id, id, file);
  }

  @Patch("users/me/projects/:id/media/reorder")
  reorderMedia(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    return this.projectsService.reorderMedia(user.id, id, body);
  }

  @Delete("users/me/projects/:id/media/:mediaId")
  deleteMedia(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Param("mediaId") mediaId: string,
  ) {
    return this.projectsService.deleteMedia(user.id, id, mediaId);
  }
}
