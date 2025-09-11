import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleItemDto } from './create-module_item.dto';

export class UpdateModuleItemDto extends PartialType(CreateModuleItemDto) {}
