import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    let { title, priority } = createCategoryDto;
    title = await this.checkExistAndResolveByTitle(title);
    let category = this.categoryRepository.create({ title, priority });
    category = await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created,
      category,
    };
  }
  async checkExistAndResolveByTitle(title: string) {
    title = title?.trim().toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException(ConflictMessage.CategoryTitle);
    return title;
  }
  async findAll(paginationDto: PaginationDto) {
    const {page, skip, limit} = paginationSolver(paginationDto)
    const [categories, count] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      data: categories,
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
