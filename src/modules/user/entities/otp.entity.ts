import { EntityNames } from 'src/common/enums/entity.enum';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from 'src/common/abstracts/base.entity';

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  userId: number;
  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  user: UserEntity;
}
