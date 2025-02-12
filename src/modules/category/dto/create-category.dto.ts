import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  priority: number;
}
