import { PartialType } from '@nestjs/mapped-types';
import { CreateModItemAssignmentDto } from './create-mod_item_assignment.dto';

export class UpdateModItemAssignmentDto extends PartialType(CreateModItemAssignmentDto) {}
