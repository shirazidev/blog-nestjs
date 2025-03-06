import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ImageDto } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { multerFile } from '../../common/utils/multer.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  AuthMessage,
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from '../../common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}
  async create(createImageDto: ImageDto, image: multerFile) {
    const userId = this.req?.user?.id;
    const { alt, name } = createImageDto;
    let location = image?.path?.slice(7);
    await this.imageRepository.insert({
      alt: alt || name,
      name,
      location,
      userId,
    });
    return {
      message: PublicMessage.Created,
    };
  }

  async findAll() {
    const userId = this.req?.user?.id;
    return await this.imageRepository.find({
      where: { userId: userId },
      order: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const userId = this.req?.user?.id;
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(NotFoundMessage.NotFoundImage);
    }
    if (image.userId !== userId) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
    return image;
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  async remove(id: number) {
    const userId = this.req?.user?.id;
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
    if (image.userId !== userId) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
    return { message: PublicMessage.Deleted };
  }
}
