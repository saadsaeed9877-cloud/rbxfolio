import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";
import { Public } from "../auth/public.decorator";

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get("search")
  search(@Query() query: Record<string, unknown>) {
    return this.searchService.search(query);
  }

  @Public()
  @Get("browse")
  browse(@Query() query: Record<string, unknown>) {
    return this.searchService.browse(query);
  }

  @Public()
  @Get("featured")
  featured() {
    return this.searchService.getFeatured();
  }
}
