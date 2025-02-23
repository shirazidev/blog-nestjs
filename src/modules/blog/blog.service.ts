import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto, FilterBlogDto } from './dtos/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { Request } from 'express';
import {
  BadRequestMessage,
  PublicMessage,
} from '../../common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../common/utils/pagination.util';
import { isArray } from 'class-validator';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { EntityNames } from '../../common/enums/entity.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    private categoryService: CategoryService,
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
    if (!isArray(categories)) {
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
  async checkExistBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
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
      .leftJoin('categories.category', 'category')
      .addSelect(['categories.id', 'category.title'])
      .where(where, parameters)
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { pagination: paginationGenerator(count, limit, page), blogs };
  }
}
