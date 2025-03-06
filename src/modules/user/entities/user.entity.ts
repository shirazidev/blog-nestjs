import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;
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
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
