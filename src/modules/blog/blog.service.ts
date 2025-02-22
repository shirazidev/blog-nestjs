import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dtos/blog.dto';
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
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from './entities/blog-category.entity';

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
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        let newCategory =
          await this.categoryService.insertByTitle(categoryTitle);
        let category = await this.blogCategoryRepository.insert({
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
  async blogsList(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    const [blogs, count] = await this.blogRepository.findAndCount({
      where: {},
      order: {
        id: 'DESC',
      },
      skip,
      take: limit,
    });
    return { pagination: paginationGenerator(count, limit, page), blogs };
  }
}
