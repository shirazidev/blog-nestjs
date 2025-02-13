import { ProfileDto } from './dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('/change-profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumesEnum.MULTIPART)
  async changeProfile(@Body() profileDto: ProfileDto) {
    return this.userService.changeProfile(profileDto);
  }
}
