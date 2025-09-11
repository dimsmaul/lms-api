import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModItemQuizQuestion } from './mod_item_quiz_question.entity';
import { ModuleItem } from 'src/module_items/entities/module_item.entity';

@Entity()
export class ModItemQuiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  duration: number;

  @Column()
  minimum_score: number;

  @Column()
  maximum_score: number;

  //   Relation

  //   ==> Question
  @OneToMany(() => ModItemQuizQuestion, (question) => question.quiz)
  question: ModItemQuizQuestion[];

  //   ==> Module item
  @OneToOne(() => ModuleItem, (item) => item.quiz)
  parent: ModuleItem;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
