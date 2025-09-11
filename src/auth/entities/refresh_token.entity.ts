import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
