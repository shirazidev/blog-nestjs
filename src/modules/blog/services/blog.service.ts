import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dtos/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { request, Request } from 'express';
import {
  AuthMessage,
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
  ValidationMessage,
} from '../../../common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../../common/utils/pagination.util';
import { isArray } from 'class-validator';
import { CategoryService } from '../../category/category.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { EntityNames } from '../../../common/enums/entity.enum';
import { BlogLikeEntity } from '../entities/like.entity';
import { BlogBookmarksEntity } from '../entities/bookmark.entity';
import { BlogCommentsEntity } from '../entities/comment.entity';
import { CommentsService } from './comments.service';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikeEntity)
    private blogLikeRepository: Repository<BlogLikeEntity>,
    private categoryService: CategoryService,
    @InjectRepository(BlogBookmarksEntity)
    private blogBookmarkRepository: Repository<BlogBookmarksEntity>,
    @InjectRepository(BlogCommentsEntity)
    private blogCommentRepository: Repository<BlogCommentsEntity>,
    @Inject(forwardRef(() => CommentsService))
    private blogCommentService: CommentsService,
    private dataSource: DataSource,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    let {
      title,
      slug,
      content,
      time_for_study,
      short_desc,
      image,
      categories,
    } = createBlogDto;
    let user = this.request?.user;
    if (!user) throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    slug = createSlug(slug?.trim() || title);
    const isExist = await this.checkExistBySlug(slug);
    if (isExist) slug += `-${randomId()}`;
    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategory);
    }

    let blog = this.blogRepository.create({
      title,
      slug,
      content,
      time_for_study,
      short_desc,
      image,
      authorId: user.id,
    });
    blog = await this.blogRepository.save(blog);
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(
        categoryTitle.toLowerCase(),
      );
      if (!category) {
        let newCategory = await this.categoryService.insertByTitle(
          categoryTitle.toLowerCase(),
        );
        await this.blogCategoryRepository.insert({
          blogId: blog.id,
          categoryId: newCategory.id,
        });
      }
    }
    return { message: PublicMessage.Created };
  }
  async findOne(slug: string, paginationDto: PaginationDto) {
    const userId = request?.user?.id;
    const blog = await this.blogRepository
      .createQueryBuilder(EntityNames.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .leftJoin('categories.category', 'category')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'profile.nick_name',
        'author.id',
      ])
      .where('blog.slug = :slug', { slug })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .getOne();
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundBlog);
    const comments = await this.blogCommentService.findPostComments(
      blog.id,
      paginationDto,
    );
    let isLiked = false;
    let isBookmarked = false;
    if (userId) {
      isLiked = !!(await this.blogLikeRepository.findOneBy({
        blogId: blog.id,
        userId: userId,
      }));
      isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({
        blogId: blog.id,
        userId: userId,
      }));
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const suggestedBlogs = await queryRunner.query(`
      WITH suggested_blogs AS (
          SELECT
              blog.id,
              blog.slug,
              blog.title,
              blog.short_desc,
              blog.time_for_study,
              blog.image,
              json_build_object(
                      'username', u.username,
                      'author_name', p.nick_name,
                      'image', p.image_profile
              ) AS author,
              array_agg(DISTINCT cat.title) AS categories,
              (
              SELECT COUNT(*) FROM blog_likes
              WHERE blog_likes."blogId" = blog.id
              ) AS likes,
              (
              SELECT COUNT(*) FROM blog_bookmarks
              WHERE blog_bookmarks."blogId" = blog.id
              ) AS bookmarks,
              (
              SELECT COUNT(*) FROM blog_comments
              WHERE blog_comments."blogId" = blog.id
              ) AS comments
          FROM blog
          LEFT JOIN public.user u ON blog."authorId" = u.id
          LEFT JOIN public.${EntityNames.Profile} p ON p."userId" = u.id
          LEFT JOIN public.${EntityNames.BlogCategory} bc ON blog.id = bc."blogId"
          LEFT JOIN public.${EntityNames.Category} cat ON bc."categoryId" = cat.id
          GROUP BY blog.id, u.username, p.nick_name, p.image_profile
          ORDER BY RANDOM()
          LIMIT 3
      )
      SELECT * FROM suggested_blogs;
    `);
    return {
      blog,
      isLiked,
      isBookmarked,
      comments,
      suggestedBlogs,
    };
  }
  async checkExistBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    if (!blog) return false;
    return blog;
  }

  async getUserBlogs() {
    let user = this.request?.user;
    if (!user) throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    return await this.blogRepository.find({
      where: { authorId: user.id },
      select: {
        id: true,
        title: true,
        short_desc: true,
        slug: true,
        status: true,
        updated_at: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async blogsList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    let { category, search } = filterDto;
    let where = '';
    const parameters: any = {};

    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += ' AND ';
      where += 'category.title = LOWER(:category)';
      parameters.category = category;
    }

    if (search) {
      if (where.length > 0) where += ' AND ';
      search = `%${search.toLowerCase()}%`;
      where +=
        'CONCAT(blog.title, blog.short_desc, blog.content) ILIKE :search';
      parameters.search = search;
    }

    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EntityNames.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .leftJoin('categories.category', 'category')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'profile.nick_name',
        'author.id',
      ])
      .where(where, parameters)
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .loadRelationCountAndMap(
        'blog.comments',
        'blog.comments',
        'comments',
        (qb) => qb.where('comments.accepted = :accepted', { accepted: true }),
      )
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { pagination: paginationGenerator(count, limit, page), blogs };
  }

  async checkExistBlogById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundBlog);
    return blog;
  }
  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const user = this.request?.user;
    let {
      title,
      slug,
      content,
      time_for_study,
      short_desc,
      image,
      categories,
    } = updateBlogDto;
    let blog = await this.checkExistBlogById(id);
    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategory);
    }
    if (!user) throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    let slugData: string | null = null;
    if (title) {
      blog.title = title;
      slugData = title;
    }
    if (slug) slugData = slug;
    if (slugData !== null) {
      slug = createSlug(slugData);
      const isExist = await this.checkExistBySlug(slug);
      if (isExist && isExist.id !== id) slug += `-${randomId()}`;
      blog.slug = slug;
    }
    if (content) blog.content = content;
    if (time_for_study) blog.time_for_study = time_for_study;
    if (short_desc) blog.short_desc = short_desc;
    if (image) blog.image = image;
    blog = await this.blogRepository.save(blog);
    if (categories && isArray(categories) && categories.length > 0) {
      await this.blogCategoryRepository.delete({ blogId: blog.id });
      for (const categoryTitle of categories) {
        let category = await this.categoryService.findOneByTitle(
          categoryTitle.toLowerCase(),
        );
        if (!category) {
          category = await this.categoryService.insertByTitle(
            categoryTitle.toLowerCase(),
          );
        }
        await this.blogCategoryRepository.insert({
          blogId: blog.id,
          categoryId: category.id,
        });
      }
    }
    return {
      message: PublicMessage.Updated,
    };
  }
  async likeToggle(id: number) {
    const user = await this.getUser();
    await this.checkExistBlogById(id);
    const isLiked = await this.blogLikeRepository.findOneBy({
      blogId: id,
      userId: user.id,
    });
    let message = PublicMessage.Liked;
    if (!isLiked) {
      await this.blogLikeRepository.insert({ blogId: id, userId: user.id });
    } else if (isLiked) {
      await this.blogLikeRepository.delete({ id: isLiked.id });
      message = PublicMessage.DisLiked;
    }
    return {
      message,
    };
  }
  async bookmarkToggle(id: number) {
    const user = await this.getUser();
    await this.checkExistBlogById(id);
    const isBookmarked = await this.blogBookmarkRepository.findOneBy({
      blogId: id,
      userId: user.id,
    });
    let message = PublicMessage.Bookmarked;
    if (!isBookmarked) {
      await this.blogBookmarkRepository.insert({ blogId: id, userId: user.id });
    } else if (isBookmarked) {
      await this.blogBookmarkRepository.delete({ id: isBookmarked.id });
      message = PublicMessage.unBookmarked;
    }
    return {
      message,
    };
  }
  async delete(id: number) {
    const blog = await this.checkExistBlogById(id);
    const userId = this.request?.user?.id;
    if (!userId) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
    if (blog.authorId !== userId) {
      throw new BadRequestException(ValidationMessage.BlogIsNotYours);
    }
    await this.blogRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
  async getUser() {
    const user = this.request?.user;
    if (!user) throw new UnauthorizedException(AuthMessage.LoginIsRequired);
    return user;
  }
}
