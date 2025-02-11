import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SwaggerConsumesEnum } from 'src/common/enums/swagger-consumes.enum';
import { Response } from 'express';


@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/user-existence')
  @ApiConsumes(SwaggerConsumesEnum.FORM, SwaggerConsumesEnum.JSON)
  async userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    const result = await this.authService.userExistence(authDto, res);
    // for production projects we use secure cookie names

  }
}
