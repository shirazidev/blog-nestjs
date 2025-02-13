import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
const { PORT, COOKIE_SECRET } = process.env;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser(COOKIE_SECRET));
  app.useStaticAssets('public');
  SwaggerConfigInit(app);
  await app.listen(PORT, () => {
    console.log(`app running on port ${PORT}: http://localhost:${PORT}`);
    console.log(`swagger running on url: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
