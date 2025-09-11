import { Course } from 'src/courses/entities/course.entity';
import { ModuleItem } from 'src/module_items/entities/module_item.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'numeric' })
  order: number;

  //   To Give Assessment Weight in percentage
  @Column({ type: 'numeric', default: 0 })
  assessmentWeight: number;

  //   Relation
  //   ==> Course
  @ManyToOne(() => Course, (course) => course.modules)
  course: Course;

  //   ==> Module Items
  @OneToMany(() => ModuleItem, (item) => item.module)
  items: ModuleItem[];

  //   Date fields
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
