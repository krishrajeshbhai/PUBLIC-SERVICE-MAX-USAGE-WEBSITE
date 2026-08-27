import { Module } from '@nestjs/common';
import { RoutingModule } from '../routing/routing.module.js';
import { JourneyController } from './journey.controller.js';

@Module({
  imports: [RoutingModule],
  controllers: [JourneyController],
})
export class JourneyModule {}
