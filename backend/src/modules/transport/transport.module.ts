import { Module } from '@nestjs/common';
import { StopsController } from './stops.controller.js';

@Module({
  controllers: [StopsController],
})
export class TransportModule {}
