import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { SwaggerConsumesEnum } from '../../../common/enums/swagger-consumes.enum';
import { CommentDto } from '../dtos/comment.dto';

@Controller('blog/comment/')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@ApiTags('Blog-Comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Post('/')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async createBlog(@Body() createCommentDto: CommentDto) {
    return await this.commentService.createComment(createCommentDto);
  }
}
