import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionBankDto } from './create-question_bank.dto';

export class UpdateQuestionBankDto extends PartialType(CreateQuestionBankDto) {}
