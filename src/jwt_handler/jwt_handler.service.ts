import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHandlerService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Extract raw token string from "Bearer <token>"
   */
  extractToken(authorizationHeader?: string): string | null {
    if (!authorizationHeader) return null;
    if (!authorizationHeader.startsWith('Bearer ')) return null;
    return authorizationHeader.split(' ')[1];
  }

  /**
   * Verify and decode token
   */
  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'default_secret',
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get userId (sub) from token
   */
  getUserIdFromToken(authorizationHeader?: string): string {
    if (!authorizationHeader)
      throw new UnauthorizedException('No token provided');

    const payload = this.verifyToken(authorizationHeader);
    return payload.sub; // asumsi payload punya "sub" sebagai userId
  }
}
