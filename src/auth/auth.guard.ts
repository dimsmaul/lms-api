import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import express from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // private reflector: Reflector,
    @Inject('JWT_ACCESS_SERVICE')
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<express.Request>();
    const authToken = req.cookies['access_token'];

    if (!authToken) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }

    const token = authToken;

    try {
      await this.jwtService.verifyAsync(token);
      // req.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
