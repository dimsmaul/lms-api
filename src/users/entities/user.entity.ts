import * as bcrypt from 'bcrypt';
import { RefreshToken } from 'src/auth/entities/refresh_token.entity';
import { Course } from 'src/courses/entities/course.entity';
import { CourseParticipants } from 'src/courses/entities/course_participant.entity';
import { ModuleItemParticipant } from 'src/module_items/entities/module_item_participant.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  // Verification fields

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  // Out of scope
  // @Column({ type: 'numeric', default: 0 })
  // roles: number; // 0--> student, 1--> trainer, 2--> superadmin

  @Column({ type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @Column({ type: 'boolean', default: false })
  isAllowedToCreateCourse: boolean; // this one need approval from super admin

  //  Relation
  @ManyToMany(() => Course, (course) => course.trainers)
  coursesTrained: Course[];

  @OneToMany(() => Course, (course) => course.createdBy)
  coursesCreated: Course[];

  @ManyToMany(() => CourseParticipants, (course) => course.user)
  coursesParticipants: CourseParticipants[];

  // ==> Module Items
  @OneToMany(() => ModuleItemParticipant, (participant) => participant.user)
  moduleItemParticipants: ModuleItemParticipant[];

  // Date fields

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  // handle refresh tokens
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @Column({ type: 'boolean', default: false })
  allowMultipleDevices: boolean;

  @BeforeInsert()
  hashPassword() {
    if (!this.password) return;
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @BeforeInsert()
  ensureUsernameIsLowercase() {
    if (!this.username || this.username.trim() === '') {
      const uuid = v4();
      const generatedUname = 'user' + uuid.slice(8);
      this.username = generatedUname;
    } else {
      this.username = this.username.toLowerCase();
    }
  }

  @BeforeUpdate()
  hashPasswordOnUpdate() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }
}
