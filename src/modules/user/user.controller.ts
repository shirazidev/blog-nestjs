import { ChangeEmailDto, ProfileDto } from './dto/user.dto';
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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  multerDestination,
  multerFilename,
  multerProfileStorage,
} from 'src/common/utils/multer.util';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('/change-profile')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image_profile', maxCount: 1 },
        { name: 'image_bg', maxCount: 1 },
      ],
      {
        storage: multerProfileStorage('user-profile'),
      },
    ),
  )
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumesEnum.MULTIPART)
  async changeProfile(
    @UploadedOptionalFiles() files: ProfileImages,
    @Body() profileDto: ProfileDto,
  ) {
    return this.userService.changeProfile(files, profileDto);
  }
  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  async profile() {
    return this.userService.getProfile();
  }
  @Patch('/change-email')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async changeEmail(@Body() changeEmailDto: ChangeEmailDto) {
    return await this.userService.changeEmail(changeEmailDto);
  }
}
