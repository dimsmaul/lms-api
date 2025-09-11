import { Module } from 'src/modules/entities/module.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseParticipants } from './course_participant.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string;

  //   Minimum passing score for the course
  @Column({ type: 'numeric', default: 60 })
  passingScore: number;

  // to make course available for all users or not
  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  // Status Approval
  @Column({ type: 'numeric', default: 0 })
  status: number; // 0 --> waiting approval, 1 --> rejected, 2 --> approved

  //   Relation
  //   ==> Users
  // @ManyToMany(() => User, (user) => user.coursesTrained)
  // @JoinTable({
  //   name: 'course_trainers',
  //   joinColumn: { name: 'courseId', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  // })
  // trainers: User[];
  @ManyToMany(() => User)
  @JoinTable({
    name: 'course_trainer', // 👈 kalau kamu kasih custom name, join table namanya ini
    joinColumn: { name: 'courseId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trainerId', referencedColumnName: 'id' },
  })
  trainers: User[];

  @ManyToOne(() => User, (user) => user.coursesCreated, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  createdBy: User;

  @OneToMany(() => CourseParticipants, (participant) => participant.course)
  participants: CourseParticipants[];

  // ==> Modules
  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];

  //   published status
  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date | null;

  //   Date fields

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
