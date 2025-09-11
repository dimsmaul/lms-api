import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as Mod } from './entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mod])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
