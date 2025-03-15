import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
}
