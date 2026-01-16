import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AUTH_KEYS } from './auth-keys.constant';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const apiKey = request.headers['authorization'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new ForbiddenException('Control key is missing');
    }

    if (!AUTH_KEYS.includes(apiKey)) {
      throw new ForbiddenException('Invalid control key');
    }

    return true;
  }
}
