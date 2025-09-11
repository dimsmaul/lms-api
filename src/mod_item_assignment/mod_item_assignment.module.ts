import { Module } from '@nestjs/common';
import { ModItemAssignmentService } from './mod_item_assignment.service';
import { ModItemAssignmentController } from './mod_item_assignment.controller';

@Module({
  controllers: [ModItemAssignmentController],
  providers: [ModItemAssignmentService],
})
export class ModItemAssignmentModule {}
