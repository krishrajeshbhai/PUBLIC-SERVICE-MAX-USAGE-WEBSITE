import { Module } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { BookingController } from './booking.controller.js';
import { WalletModule } from '../wallet/wallet.module.js';
import { RoutingModule } from '../routing/routing.module.js';

@Module({
  imports: [WalletModule, RoutingModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
