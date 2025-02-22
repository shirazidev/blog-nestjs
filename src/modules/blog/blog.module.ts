import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogLikeEntity } from './entities/like.entity';
import { BlogCommentsEntity } from './entities/comment.entity';
import { BlogBookmarksEntity } from './entities/bookmark.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { BlogCategoryEntity } from './entities/blog-category.entity';

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogCategoryEntity,
      BlogLikeEntity,
      BlogCommentsEntity,
      BlogBookmarksEntity,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
