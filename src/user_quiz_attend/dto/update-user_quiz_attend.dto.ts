import { PartialType } from '@nestjs/mapped-types';
import { CreateUserQuizAttendDto } from './create-user_quiz_attend.dto';

export class UpdateUserQuizAttendDto extends PartialType(CreateUserQuizAttendDto) {}
