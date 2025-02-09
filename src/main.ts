import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
const {PORT} = process.env ?? 3000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  await app.listen(PORT, () => {
    console.log(`app running on port ${PORT}: http://localhost:${PORT}`);
  });
}
bootstrap();
