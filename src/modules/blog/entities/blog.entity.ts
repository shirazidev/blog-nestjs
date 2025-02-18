import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BlogStatus } from '../enums/status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BlogLikeEntity } from './like.entity';
import { BlogBookmarksEntity } from './bookmark.entity';
import { BlogCommentsEntity } from './comment.entity';
import { BlogCategoryEntity } from './blog-category.entity';

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;
  @Column()
  short_desc: string;
  @Column()
  content: string;
  @Column({ nullable: true })
  image: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  time_for_study: string;
  @Column()
  authorId: number;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  author: UserEntity;
  @OneToMany(() => BlogCategoryEntity, (category) => category.blog)
  categories: BlogCategoryEntity[];
  @OneToMany(() => BlogLikeEntity, (like) => like.blog)
  likes: BlogLikeEntity[];
  @OneToMany(() => BlogBookmarksEntity, (bookmark) => bookmark.blog)
  bookmarks: BlogBookmarksEntity[];
  @OneToMany(() => BlogCommentsEntity, (comment) => comment.blog)
  comments: BlogCommentsEntity[];
  @Column({ default: BlogStatus.Draft })
  status: string;
  @CreateDateColumn()
  created_at: Date;
  @CreateDateColumn()
  updated_at: Date;
}
