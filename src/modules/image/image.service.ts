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
  create(createImageDto: ImageDto, image: multerFile) {
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

    return image;
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
