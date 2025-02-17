import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(10, 150)
    title: string;
    @ApiPropertyOptional()
    slug: string;
    @ApiProperty()
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
    @ApiPropertyOptional({format: "binary"})
    image: string;

}