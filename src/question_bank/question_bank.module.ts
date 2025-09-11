import { Module } from '@nestjs/common';
import { QuestionBankService } from './question_bank.service';
import { QuestionBankController } from './question_bank.controller';

@Module({
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
})
export class QuestionBankModule {}
