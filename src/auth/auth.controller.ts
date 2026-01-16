import { Body, Controller, Post } from '@nestjs/common';
import { AUTH_KEYS } from './auth-keys.constant';
import { AuthKeyDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() dto: AuthKeyDto): boolean {
    return AUTH_KEYS.includes(dto.key);
  }
}
