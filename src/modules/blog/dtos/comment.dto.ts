import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional, Length } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  @Length(5)
  text: string;
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  parentId?: number;
  @ApiProperty()
  @IsNumberString()
  blogId: number;
}
