import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        // url: configService.get<string>('DATABASE_URL'),
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,

        autoLoadEntities: true,
        synchronize: true,
        // ssl: {
        //   rejectUnauthorized: false,
        // },
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}