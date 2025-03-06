import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { EntityNames } from '../../../common/enums/entity.enum';
@Entity(EntityNames.Images)
export class ImageEntity extends BaseEntity {
  @Column()
  name: string;
  @Column()
  location: string;
  @Column()
  alt: string;
  @Column()
  userId: number;
  @CreateDateColumn()
  created_at: Date;
  @ManyToOne(() => UserEntity, (user) => user.images)
  user: UserEntity;
}
