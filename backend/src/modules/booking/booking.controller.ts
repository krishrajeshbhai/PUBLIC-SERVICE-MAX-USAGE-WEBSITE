import { Controller, Post, Body, Headers, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingService } from './booking.service.js';
import { BookTicketDto } from './dto/book-ticket.dto.js';

@ApiTags('booking')
@Controller({ path: 'tickets', version: '1' })
export class BookingController {
  constructor(
    @Inject(BookingService) private readonly bookingService: BookingService,
  ) {}

  @Post('book')
  @ApiOperation({ summary: 'Book one journey option, deduct wallet balance' })
  @ApiResponse({ status: 201, description: 'Returns issued ticket and updated wallet balance' })
  async book(
    @Body() dto: BookTicketDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.bookingService.bookTicket(dto, idempotencyKey);
  }
}
