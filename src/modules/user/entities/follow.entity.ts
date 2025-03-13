import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { UserEntity } from './user.entity';

@Entity('follow')
export class FollowEntity extends BaseEntity {
  @Column()
  followingId: number;
  @Column()
  followerId: number;
  @ManyToOne(() => UserEntity, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  follower: UserEntity;
  @ManyToOne(() => UserEntity, (user) => user.followings, {
    onDelete: 'CASCADE',
  })
  following: UserEntity;
  @CreateDateColumn()
  created_at: Date;
}
