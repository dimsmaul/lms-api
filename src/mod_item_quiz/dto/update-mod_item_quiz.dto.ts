import { PartialType } from '@nestjs/mapped-types';
import { CreateModItemQuizDto } from './create-mod_item_quiz.dto';

export class UpdateModItemQuizDto extends PartialType(CreateModItemQuizDto) {}
