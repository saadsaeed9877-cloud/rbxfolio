import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUser } from "./session.guard";

export const OptionalUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
