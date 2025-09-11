import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('course_participants')
@Unique(['user', 'course'])
export class CourseParticipants {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  progress: number;

  @Column({ type: 'varchar', default: '0' })
  finalScore: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => User, (user) => user.coursesParticipants, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Course, (course) => course.participants, {
    onDelete: 'CASCADE',
  })
  course: Course;
}
