import {
  ModItemQuizQuestion,
  ModItemQuizQuestionMultipleMetadata,
} from 'src/mod_item_quiz/entities/mod_item_quiz_question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuestionBank {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  question: string;

  @Column({
    type: 'enum',
    enum: ['essay', 'multiple-choice', 'true-false'],
    default: 'multiple-choice',
  })
  typeQuestion: 'essay' | 'multiple-choice' | 'true-false';

  @Column({ type: 'numeric', default: 0 })
  score: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correctAnswer: string | null; // null if multiple-choice

  // Relation to multiple choice options
  @OneToMany(
    () => ModItemQuizQuestionMultipleMetadata,
    (metadata) => metadata.question,
    { cascade: true, eager: true, nullable: true },
  )
  multipleChoiceOptions: ModItemQuizQuestionMultipleMetadata[];

  @OneToMany(() => ModItemQuizQuestion, (question) => question.bankQuestion, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  modItemQuizQuestions: ModItemQuizQuestion[];
}
