import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioService } from 'src/minio/minio.service';
import { RefreshToken } from './entities/refresh_token.entity';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),

    ConfigModule,
    // JwtModule,
    // Using ConfigService for JWT secrets
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '15m' },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: process.env.JWT_REFRESH_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MinioService,

    // JWT Services
    {
      provide: 'JWT_ACCESS_SERVICE',
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '15m' },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'JWT_REFRESH_SERVICE',
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: process.env.JWT_REFRESH_SECRET,
          signOptions: { expiresIn: '7d' },
        });
      },
      inject: [ConfigService],
    },
    AuthGuard
  ],
  exports: [JwtModule, 'JWT_ACCESS_SERVICE', 'JWT_REFRESH_SERVICE', AuthGuard]
})
export class AuthModule {}
