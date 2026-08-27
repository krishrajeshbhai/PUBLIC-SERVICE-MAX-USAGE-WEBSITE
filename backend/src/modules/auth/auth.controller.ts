import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password?: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('employee')
  async employeeLogin(@Body() body: { staffId: string; dept: string; securityPin: string }) {
    return this.authService.employeeLogin(body.staffId, body.dept, body.securityPin);
  }
}
