import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { OtpEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { BlogLikeEntity } from 'src/modules/blog/entities/like.entity';
import { BlogBookmarksEntity } from 'src/modules/blog/entities/bookmark.entity';
import { BlogCommentsEntity } from 'src/modules/blog/entities/comment.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { Roles } from '../../../common/enums/role.enum';
import { FollowEntity } from './follow.entity';
import { UserStatus } from '../enums/status.enum';

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ nullable: false, default: Roles.User })
  role: string;
  @Column({ nullable: false, default: UserStatus.Normal })
  status: string;
  @Column({ unique: true, nullable: true })
  newEmail: string;
  @Column({ unique: true, nullable: true })
  newPhone: string;
  @Column({ default: false })
  verifyEmail: boolean;
  @Column({ default: false, nullable: true })
  verifyPhone: boolean;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => OtpEntity, (otp) => otp.user, {
    nullable: true,
  })
  @JoinColumn()
  otp: OtpEntity;
  @Column({ nullable: true })
  profileId: number;
  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    nullable: true,
  })
  @JoinColumn()
  profile: ProfileEntity;
  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];
  @OneToMany(() => BlogLikeEntity, (like) => like.user)
  blog_likes: BlogLikeEntity[];
  @OneToMany(() => BlogBookmarksEntity, (bookmark) => bookmark.user)
  blog_bookmarks: BlogBookmarksEntity[];
  @OneToMany(() => BlogCommentsEntity, (comment) => comment.user)
  blog_comments: BlogCommentsEntity[];
  @OneToMany(() => ImageEntity, (image) => image.user)
  images: ImageEntity[];
  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];
  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  followings: FollowEntity[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
