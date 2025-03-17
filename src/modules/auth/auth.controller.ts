import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';
import { Request, Response } from 'express';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/user-existence')
  @ApiConsumes(SwaggerConsumesEnum.FORM, SwaggerConsumesEnum.JSON)
  async userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    const result = await this.authService.userExistence(authDto, res);
    // for production projects we use secure cookie names
  }
  @Post('/check-otp')
  @ApiConsumes(SwaggerConsumesEnum.FORM, SwaggerConsumesEnum.JSON)
  async checkOtp(@Body() checkOtpDto: CheckOtpDto, @Res() res: Response) {
    const result = await this.authService.checkOtp(checkOtpDto);
    res.json({ result });
    // for production projects we use secure cookie names
  }
  @Get('/check-auth')
  @AuthDecorator()
  @CanAccess(Roles.Admin, Roles.User)
  async checkAuth(@Req() req: Request) {
    return req.user;
  }
}
