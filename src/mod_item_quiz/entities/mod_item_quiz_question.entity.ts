import { QuestionBank } from 'src/question_bank/entities/question_bank.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModItemQuiz } from './mod_item_quiz.entity';

@Entity('mod_item_quiz_question')
export class ModItemQuizQuestion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  question: string;

  @Column({ type: 'varchar', nullable: true })
  attachment: string;

  @Column({
    type: 'enum',
    enum: ['essay', 'multiple-choice', 'true-false'],
    default: 'multiple-choice',
    nullable: true,
  })
  typeQuestion: 'essay' | 'multiple-choice' | 'true-false' | null; // null if get from bank

  @Column({ type: 'numeric', default: 0 })
  score: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correctAnswer: string | null; // null if multiple-choice and get from bank

  // Relation to multiple choice options

  // ==> Quiz
  @ManyToOne(() => ModItemQuiz, (item) => item.question)
  quiz: ModItemQuiz;

  // ==> Multiple Metadata
  @OneToMany(
    () => ModItemQuizQuestionMultipleMetadata,
    (metadata) => metadata.question,
    { cascade: true, eager: true, nullable: true },
  )
  multipleChoiceOptions: ModItemQuizQuestionMultipleMetadata[] | null; // null if get from bank

  // Relation to Question Bank
  @ManyToOne(() => QuestionBank, (question) => question.modItemQuizQuestions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  bankQuestion: QuestionBank | null; // null if not from bank
}

@Entity('question_multiple_metadata')
export class ModItemQuizQuestionMultipleMetadata {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  option: string;

  @Column({ type: 'varchar', nullable: true })
  attachment: string;

  @ManyToOne(
    () => ModItemQuizQuestion,
    (question) => question.multipleChoiceOptions,
    { nullable: true, onDelete: 'CASCADE' },
  )
  question: ModItemQuizQuestion | null; // null if connect with bank

  @ManyToOne(() => QuestionBank, (question) => question.multipleChoiceOptions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  bankQuestion: QuestionBank | null; // null if not from bank;
}
