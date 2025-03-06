import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dtos/blog.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';
import { FilterBlog } from '../../../common/decorators/filter.decorator';
import { Pagination } from '../../../common/decorators/pagination.decorator';
import { AuthDecorator } from '../../../common/decorators/auth.decorator';

@Controller('blog')
@AuthDecorator()
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('/')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.createBlog(createBlogDto);
  }
  @Get('/user')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async getUserBlogs() {
    return await this.blogService.getUserBlogs();
  }
  @Get('/')
  @SkipAuth()
  @FilterBlog()
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async find(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBlogDto,
  ) {
    return await this.blogService.blogsList(paginationDto, filterDto);
  }
  @Get('/:slug')
  @Pagination()
  @SkipAuth()
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async findOne(
    @Query('slug') slug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.blogService.findOne(slug, paginationDto);
  }
  @Put('/:id')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return await this.blogService.update(id, updateBlogDto);
  }
  @Get('/like/:id')
  async like(@Param('id', ParseIntPipe) id: number) {
    return await this.blogService.likeToggle(id);
  }
  @Get('/bookmark/:id')
  async bookmark(@Param('id', ParseIntPipe) id: number) {
    return await this.blogService.bookmarkToggle(id);
  }
  @Delete('/:id')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.blogService.delete(id);
  }
}
