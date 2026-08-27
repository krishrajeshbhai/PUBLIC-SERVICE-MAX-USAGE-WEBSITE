var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { OperationsController } from './operations.controller.js';
import { AssistantController } from './assistant.controller.js';
import { WalletModule } from '../wallet/wallet.module.js';
import { RoutingModule } from '../routing/routing.module.js';
import { BookingModule } from '../booking/booking.module.js';
let OperationsModule = class OperationsModule {
};
OperationsModule = __decorate([
    Module({
        imports: [WalletModule, RoutingModule, BookingModule],
        controllers: [OperationsController, AssistantController],
    })
], OperationsModule);
export { OperationsModule };
//# sourceMappingURL=operations.module.js.map