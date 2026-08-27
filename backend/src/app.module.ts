import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { RedisModule } from './modules/redis/redis.module.js';
import { TransportModule } from './modules/transport/transport.module.js';
import { RoutingModule } from './modules/routing/routing.module.js';
import { JourneyModule } from './modules/journey/journey.module.js';
import { WalletModule } from './modules/wallet/wallet.module.js';
import { BookingModule } from './modules/booking/booking.module.js';
import { RealtimeModule } from './modules/realtime/realtime.module.js';
import { OperationsModule } from './modules/operations/operations.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { VisitorModule } from './modules/visitor/visitor.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    TransportModule,
    RoutingModule,
    JourneyModule,
    WalletModule,
    BookingModule,
    RealtimeModule,
    OperationsModule,
    AuthModule,
    VisitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
