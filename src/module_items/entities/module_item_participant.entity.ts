import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ModuleItem } from './module_item.entity';

@Entity()
export class ModuleItemParticipant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'float', default: 0 })
  progress: number;

  @Column({ type: 'varchar' })
  finalScore: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => User, (user) => user.moduleItemParticipants)
  user: User;

  @ManyToOne(() => ModuleItem, (item) => item.participants)
  moduleItem: ModuleItem;
}
