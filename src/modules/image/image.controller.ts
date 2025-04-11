import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageDto } from "./dto/image.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "../../common/decorators/auth.decorator";
import { UploadFile } from "../../common/interceptors/upload.interceptor";
import { multerFile } from "../../common/utils/multer.util";
import { SwaggerConsumesEnum } from "../../common/enums/swagger-consumes.enum";

@Controller("image")
@ApiTags("images")
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  @UseInterceptors(UploadFile("image"))
  create(@Body() createImageDto: ImageDto, @UploadedFile() image: multerFile) {
    return this.imageService.create(createImageDto, image);
  }

  @Get()
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  findAll() {
    return this.imageService.findAll();
  }

  @Get(":id")
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  findOne(@Param("id") id: string) {
    return this.imageService.findOne(+id);
  }

  @Delete(":id")
  @ApiConsumes(SwaggerConsumesEnum.JSON, SwaggerConsumesEnum.FORM)
  remove(@Param("id") id: string) {
    return this.imageService.remove(+id);
  }
}
