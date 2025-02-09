import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
const port = process.env.PORT ?? 3000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`app running on port ${port}: http://localhost:${port}`);
  });
}
bootstrap();
