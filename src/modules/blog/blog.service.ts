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

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}
  async createBlog(createBlogDto: CreateBlogDto) {
    let { title, slug, content, time_for_study, short_desc, image } =
      createBlogDto;
    let user = this.request?.user;
    if (!user) throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    slug = createSlug(slug?.trim() || title);
    const isExist = await this.checkExistBySlug(slug);
    if (isExist) slug += `-${randomId()}`;
    let blog = this.blogRepository.create({
      title,
      slug,
      content,
      time_for_study,
      short_desc,
      image,
      authorId: user.id,
    });
    await this.blogRepository.save(blog);
    return { message: PublicMessage.Created };
  }
  async checkExistBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
  }
}
