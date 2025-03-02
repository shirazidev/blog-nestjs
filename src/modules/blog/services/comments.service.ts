import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { BlogService } from './blog.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCommentsEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { REQUEST } from '@nestjs/core';

import {
  BadRequestMessage,
  PublicMessage,
} from '../../../common/enums/message.enum';
import { CommentDto } from '../dtos/comment.dto';
import { Request } from 'express';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../../common/utils/pagination.util';
import { CommentQueryDto } from '../dtos/blog.dto';

@Injectable({ scope: Scope.REQUEST })
export class CommentsService {
  constructor(
    private blogService: BlogService,
    @InjectRepository(BlogCommentsEntity)
    private blogCommentRepository: Repository<BlogCommentsEntity>,
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}
  async createComment(commentDto: CommentDto) {
    const user = await this.blogService.getUser();
    let { text, parentId = undefined, blogId } = commentDto;
    let parent: BlogCommentsEntity | null = null;
    if (!blogId) throw new BadRequestException(BadRequestMessage.CannotComment);
    if (!text) throw new BadRequestException(BadRequestMessage.InvalidComment);
    if (parentId && !isNaN(parentId)) {
      parent = await this.blogCommentRepository.findOneBy({ id: +parentId });
      if (!parent) {
        throw new BadRequestException(BadRequestMessage.InvalidComment);
      }
    }
    await this.blogService.checkExistBlogById(blogId);
    await this.blogCommentRepository.insert({
      text,
      parentId,
      userId: user.id,
      blogId,
    });
    return {
      message: PublicMessage.Created,
    };
  }
  async findPostComments(
    idDto: CommentQueryDto,
    paginationDto: PaginationDto,
  ): Promise<{ pagination: any; comments: BlogCommentsEntity[] }> {
    if (!idDto.id || isNaN(idDto.id)) {
      throw new BadRequestException(BadRequestMessage.InvalidComment);
    }
    const blog = await this.blogService.checkExistBlogById(idDto.id);
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: { blogId: blog.id },
      relations: { user: { profile: true }, blog: true },
      select: {
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
        blog: {
          title: true,
        },
      },
      skip,
      take: limit,
      order: { id: 'desc' },
    });
    return {
      pagination: paginationGenerator(count, limit, page),
      comments,
    };
  }
  async acceptBlog(id: number) {
    let comment = await this.checkExistById(id);
    await this.blogCommentRepository.update(comment.id, { accepted: true });
    return {
      message: PublicMessage.Accepted,
    };
  }
  async rejectBlog(id: number) {
    let comment = await this.checkExistById(id);
    await this.blogCommentRepository.update(comment.id, { accepted: false });
    return {
      message: PublicMessage.Rejected,
    };
  }
  async checkExistById(id: number) {
    const comment = await this.blogCommentRepository.findOneBy({ id });
    if (!comment) {
      throw new BadRequestException(BadRequestMessage.InvalidComment);
    }
    return comment;
  }
}
