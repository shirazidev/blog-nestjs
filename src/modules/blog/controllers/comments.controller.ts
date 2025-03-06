import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { SwaggerConsumesEnum } from '../../../common/enums/swagger-consumes.enum';
import { CommentDto } from '../dtos/comment.dto';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { Pagination } from '../../../common/decorators/pagination.decorator';
import { AuthDecorator } from '../../../common/decorators/auth.decorator';

@Controller('blog/comment/')
@AuthDecorator()
@ApiTags('Blog-Comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Get('/:id')
  @SkipAuth()
  @Pagination()
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async findComments(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.commentService.findPostComments(id, paginationDto);
  }
  @Post('/')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async createBlog(@Body() createCommentDto: CommentDto) {
    return await this.commentService.createComment(createCommentDto);
  }
  @Put('/accept/:id')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async acceptBlog(@Param('id', ParseIntPipe) id: number) {
    return await this.commentService.acceptBlog(id);
  }
  @Put('/reject/:id')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async rejectBlog(@Param('id', ParseIntPipe) id: number) {
    return await this.commentService.rejectBlog(id);
  }
}
