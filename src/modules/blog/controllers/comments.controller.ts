import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { SwaggerConsumesEnum } from '../../../common/enums/swagger-consumes.enum';
import { CommentDto } from '../dtos/comment.dto';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';
import { FilterBlog } from '../../../common/decorators/filter.decorator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { CommentQueryDto, FilterBlogDto } from '../dtos/blog.dto';
import { Pagination } from '../../../common/decorators/pagination.decorator';

@Controller('blog/comment/')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@ApiTags('Blog-Comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Get('/')
  @SkipAuth()
  @Pagination()
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async findComments(
    @Query() idDto: CommentQueryDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.commentService.findPostComments(idDto, paginationDto);
  }
  @Post('/')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async createBlog(@Body() createCommentDto: CommentDto) {
    return await this.commentService.createComment(createCommentDto);
  }
}
