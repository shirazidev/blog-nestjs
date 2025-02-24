import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 150)
  title: string;
  @ApiPropertyOptional()
  slug: string;
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  time_for_study: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 300)
  short_desc: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(100)
  content: string;
  @ApiPropertyOptional()
  image: string;
  @ApiProperty({ type: 'string', isArray: true })
  // @IsArray()
  @IsNotEmpty()
  categories: string[] | string;
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class FilterBlogDto {
  category: string;
  search: string;
}
