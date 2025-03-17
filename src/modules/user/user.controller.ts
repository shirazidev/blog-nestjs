import {
  ChangeEmailDto,
  ChangePhoneDto,
  ChangeUsernameDto,
  ProfileDto,
  VerifyDto,
} from './dto/user.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerProfileStorage } from 'src/common/utils/multer.util';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { cookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/enums/message.enum';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';
import { BanUserDto } from './dto/ban-user.dto';

@Controller('user')
@ApiTags('User')
@AuthDecorator()
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
  @ApiConsumes(SwaggerConsumesEnum.MULTIPART)
  async changeProfile(
    @UploadedOptionalFiles() files: ProfileImages,
    @Body() profileDto: ProfileDto,
  ) {
    return this.userService.changeProfile(files, profileDto);
  }
  @Get('/profile')
  @CanAccess(Roles.User, Roles.Admin)
  async profile() {
    return this.userService.getProfile();
  }
  @Patch('/change-username')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async changeUsername(@Body() changeUsernameDto: ChangeUsernameDto) {
    return await this.userService.changeUserName(changeUsernameDto.username);
  }
  @Patch('/change-email')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async changeEmail(
    @Body() changeEmailDto: ChangeEmailDto,
    @Res() res: Response,
  ) {
    const { code, emailToken, message } =
      await this.userService.changeEmail(changeEmailDto);
    if (message && !code && !emailToken) return res.json({ message });
    res.cookie(cookieKeys.EmailOTP, emailToken, CookiesOptionsToken());
    return res.json({
      message: PublicMessage.SentOtp,
      code,
    });
  }
  @Patch('/verify-email')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async verifyEmail(@Body() verifyEmailDto: VerifyDto) {
    return this.userService.verifyEmail(verifyEmailDto.code);
  }
  @Patch('/change-phone')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async changePhone(
    @Body() changePhoneDto: ChangePhoneDto,
    @Res() res: Response,
  ) {
    const { code, phoneToken, message } = await this.userService.changePhone(
      changePhoneDto.phone,
    );
    if (message && !code && !phoneToken) return res.json({ message });
    res.cookie(cookieKeys.PhoneOTP, phoneToken, CookiesOptionsToken());
    return res.json({
      message: PublicMessage.SentOtp,
      code,
    });
  }
  @Patch('/verify-phone')
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  async verifyPhone(@Body() verifyPhoneDto: VerifyDto) {
    return this.userService.verifyPhone(verifyPhoneDto.code);
  }
  @Get('/follow/:id')
  @CanAccess(Roles.Admin, Roles.User)
  async followUser(@Param('id') id: number) {
    return this.userService.followToggle(id);
  }
  @Get('/followers/:username')
  @CanAccess(Roles.Admin, Roles.User)
  async userFollowers(@Param('username') username: string) {
    return this.userService.userFollowers(username);
  }
  @Get('/followings/:username')
  @CanAccess(Roles.Admin, Roles.User)
  async userFollowings(@Param('username') username: string) {
    return this.userService.userFollowings(username);
  }
  @Post('/ban/:username')
  @CanAccess(Roles.Admin)
  async banToggle(@Body() banUserDto: BanUserDto) {
    return this.userService.banToggle(banUserDto);
  }
}
