import { Module } from 'src/modules/entities/module.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModuleItemParticipant } from './module_item_participant.entity';
import { ModItemQuiz } from 'src/mod_item_quiz/entities/mod_item_quiz.entity';

@Entity()
export class ModuleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'numeric', default: 0 })
  order: number;

  //   value just can 1,2,3,4
  @Column({ type: 'numeric', default: 1 })
  type: number; // 1=> pdf, 2=> video, 3=> quiz, 4=> assignment

  @Column({ type: 'varchar', default: null, nullable: true })
  sourceUrl: string | null; // for pdf, video

  //   Relation
  //   ==> Module
  @ManyToOne(() => Module, (module) => module.items)
  module: Module;

  //   ==> Participants
  @OneToMany(
    () => ModuleItemParticipant,
    (participant) => participant.moduleItem,
  )
  participants: ModuleItemParticipant[];

  //   TODO: need fields to relation if quiz or assignment
  @OneToOne(() => ModItemQuiz, (item) => item.parent, { nullable: true })
  quiz: ModItemQuiz | null;

  //   Date fields
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
