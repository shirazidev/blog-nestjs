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
}
