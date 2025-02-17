import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dtos/blog.dto';
import { createSlug } from 'src/common/utils/functions.util';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity)
        private blogRepository: Repository<BlogEntity>,
    ){}
    async createBlog(createBlogDto: CreateBlogDto) {
        let {title, slug} = createBlogDto;
        let slugData = slug ?? title
        createBlogDto.slug = createSlug(slugData)
        return createBlogDto
    }
}
