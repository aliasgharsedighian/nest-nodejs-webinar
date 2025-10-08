import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { SearchRequestDto } from './search-all.request.dto';
import { AllSearchService } from './search-all.service';

@Controller(routesV1.version)
export class AllSearchHttpController {
  constructor(private readonly searchService: AllSearchService) {}

  @ApiOperation({ summary: 'Search products, projects, and labeled images' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @Get(routesV1.search.searchAll)
  async search(@Query() query: SearchRequestDto) {
    return this.searchService.execute(query.query);
  }
}
