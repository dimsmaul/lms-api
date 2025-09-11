import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from './minio/minio.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { ModuleItemsModule } from './module_items/module_items.module';
import { ModItemQuizModule } from './mod_item_quiz/mod_item_quiz.module';
import { ModItemAssignmentModule } from './mod_item_assignment/mod_item_assignment.module';
import { QuestionBankModule } from './question_bank/question_bank.module';
import { UserQuizAttendModule } from './user_quiz_attend/user_quiz_attend.module';
import { AuthModule } from './auth/auth.module';
import { JwtHandlerService } from './jwt_handler/jwt_handler.service';

@Module({
  imports: [
    // Database,
    DatabaseModule,

    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Third-party modules

    // Modules
    UsersModule,

    MinioModule,

    CoursesModule,

    ModulesModule,

    ModuleItemsModule,

    ModItemQuizModule,

    ModItemAssignmentModule,

    QuestionBankModule,

    UserQuizAttendModule,

    AuthModule,
  ],
  controllers: [],
  providers: [JwtHandlerService],
  exports: [JwtHandlerService],
})
export class AppModule {}
