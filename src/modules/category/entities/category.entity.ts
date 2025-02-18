import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { BlogCategoryEntity } from '../../blog/entities/blog-category.entity';

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;
  @Column({ nullable: true })
  priority: number;
  @OneToMany(() => BlogCategoryEntity, (blog) => blog.category)
  blog_categories: BlogCategoryEntity[];
}
