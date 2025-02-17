import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/blog.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';

@Controller('blog')
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.createBlog(createBlogDto);
  }
}
