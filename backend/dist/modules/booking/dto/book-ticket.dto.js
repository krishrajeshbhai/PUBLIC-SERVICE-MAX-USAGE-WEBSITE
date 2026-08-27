var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class BookTicketDto {
    userId;
    journeyOptionId;
    chosenOption;
}
__decorate([
    ApiProperty({ example: 'user-1' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], BookTicketDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({ example: 'jo-fastest-stop-10-stop-5-1787826640331-260' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], BookTicketDto.prototype, "journeyOptionId", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Object)
], BookTicketDto.prototype, "chosenOption", void 0);
//# sourceMappingURL=book-ticket.dto.js.map