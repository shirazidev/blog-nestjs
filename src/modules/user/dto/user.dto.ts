import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, isEnum, Length } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional()
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({format: "binary"})
  image_profile: string;
  @ApiPropertyOptional({format: "binary"})
  image_bg: string;
  @ApiPropertyOptional({enum: Gender})
  @IsEnum(Gender)
  gender: string;
  @ApiPropertyOptional({example: "2025-02-13T15:18:49.740Z"})
  birth_date: Date;
  @ApiPropertyOptional()
  linkedin: string;
  @ApiPropertyOptional()
  twitter: string;
}
