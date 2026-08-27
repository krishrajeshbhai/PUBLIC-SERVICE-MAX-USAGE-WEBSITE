import { Controller, Get, Param, Query } from '@nestjs/common';
import { VisitorService } from './visitor.service.js';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Get('attractions')
  async getAttractions(@Query('category') category?: string) {
    return this.visitorService.getAttractions(category);
  }

  @Get('attractions/:id')
  async getAttractionDetail(@Param('id') id: string) {
    return this.visitorService.getAttractionDetail(id);
  }
}
