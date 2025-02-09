import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from '../../config/typeorm.config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: join(process.cwd(), '.env'),
  }),
  TypeOrmModule.forRootAsync({
    useFactory: TypeOrmDbConfig
  }),
  AuthModule,
  UserModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
