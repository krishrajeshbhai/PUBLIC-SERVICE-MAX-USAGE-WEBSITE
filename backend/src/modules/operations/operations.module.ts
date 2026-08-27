import { Module } from '@nestjs/common';
import { OperationsController } from './operations.controller.js';
import { AssistantController } from './assistant.controller.js';
import { WalletModule } from '../wallet/wallet.module.js';
import { RoutingModule } from '../routing/routing.module.js';
import { BookingModule } from '../booking/booking.module.js';

@Module({
  imports: [WalletModule, RoutingModule, BookingModule],
  controllers: [OperationsController, AssistantController],
})
export class OperationsModule {}
