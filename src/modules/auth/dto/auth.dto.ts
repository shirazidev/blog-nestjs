import { IsEnum, IsString, Length } from 'class-validator';
import { AuthMethod } from '../enums/method.enum';
import { AuthTypeEnum } from './../enums/type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
  @ApiProperty({ enum: AuthTypeEnum })
  @IsEnum(AuthTypeEnum)
  type: string;
  @ApiProperty({ enum: AuthMethod })
  @IsEnum(AuthMethod)
  method: string;
}
