import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, isEnum, IsOptional, Length } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({format: "binary"})
  @IsOptional()
  image_profile: string;
  @ApiPropertyOptional({format: "binary"})
  @IsOptional()
  image_bg: string;
  @ApiPropertyOptional({enum: Gender})
  @IsOptional()
  @IsEnum(Gender)
  gender: string;
  @ApiPropertyOptional({example: "2025-02-13T15:18:49.740Z"})
  @IsOptional()
  birth_date: Date;
  @ApiPropertyOptional()
  @IsOptional()
  linkedin: string;
  @ApiPropertyOptional()
  @IsOptional()
  twitter: string;
}
