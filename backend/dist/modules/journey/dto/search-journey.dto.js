var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class PreferencesDto {
    accessible;
}
__decorate([
    ApiProperty({ required: false, default: false }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], PreferencesDto.prototype, "accessible", void 0);
export class SearchJourneyDto {
    originStopId;
    destinationStopId;
    prefs;
}
__decorate([
    ApiProperty({ example: 'stop-10' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SearchJourneyDto.prototype, "originStopId", void 0);
__decorate([
    ApiProperty({ example: 'stop-5' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SearchJourneyDto.prototype, "destinationStopId", void 0);
__decorate([
    ApiProperty({ required: false, type: PreferencesDto }),
    IsOptional(),
    ValidateNested(),
    Type(() => PreferencesDto),
    __metadata("design:type", PreferencesDto)
], SearchJourneyDto.prototype, "prefs", void 0);
//# sourceMappingURL=search-journey.dto.js.map