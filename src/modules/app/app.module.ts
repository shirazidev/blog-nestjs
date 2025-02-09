import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from '../../config/typeorm.config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: join(process.cwd(), '.env'),
  }),
  TypeOrmModule.forRootAsync({
    useFactory: TypeOrmDbConfig
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
